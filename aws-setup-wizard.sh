#!/bin/bash

# AWS EC2 Ubuntu Setup Wizard for SecureKasir Backend
# This script automates the setup process on a fresh Ubuntu 22.04 EC2 instance

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="SecureKasir-Backend"
APP_PORT=5000
REPO_URL="your-repo-url"  # Update this

# Helper functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Step 1: Update System
step_update_system() {
    print_header "Step 1: Updating System Packages"
    
    sudo apt update
    sudo apt upgrade -y
    sudo apt install -y build-essential
    
    print_success "System updated"
}

# Step 2: Install Node.js
step_install_nodejs() {
    print_header "Step 2: Installing Node.js"
    
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    print_success "Node.js $NODE_VERSION installed"
    print_success "npm $NPM_VERSION installed"
}

# Step 3: Install PM2
step_install_pm2() {
    print_header "Step 3: Installing PM2"
    
    sudo npm install -g pm2
    pm2 install pm2-logrotate
    
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 $PM2_VERSION installed"
}

# Step 4: Install Nginx
step_install_nginx() {
    print_header "Step 4: Installing Nginx"
    
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    
    print_success "Nginx installed and started"
}

# Step 5: Install Certbot
step_install_certbot() {
    print_header "Step 5: Installing Certbot (SSL)"
    
    sudo apt install -y certbot python3-certbot-nginx
    
    print_success "Certbot installed"
}

# Step 6: Install Git
step_install_git() {
    print_header "Step 6: Installing Git"
    
    sudo apt install -y git
    
    GIT_VERSION=$(git --version)
    print_success "$GIT_VERSION installed"
}

# Step 7: Clone Project
step_clone_project() {
    print_header "Step 7: Cloning Project"
    
    cd ~
    
    if [ ! -d "$PROJECT_NAME" ]; then
        git clone $REPO_URL $PROJECT_NAME
        print_success "Project cloned"
    else
        print_info "Project directory already exists"
    fi
}

# Step 8: Install Dependencies
step_install_dependencies() {
    print_header "Step 8: Installing Project Dependencies"
    
    cd ~/$PROJECT_NAME
    npm install
    
    print_success "Dependencies installed"
}

# Step 9: Setup Environment
step_setup_environment() {
    print_header "Step 9: Setting Up Environment"
    
    cd ~/$PROJECT_NAME
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_info "Created .env from .env.example"
            print_error "⚠️  IMPORTANT: Update .env file with production values"
            print_info "nano ~/$PROJECT_NAME/.env"
            read -p "Press Enter after updating .env file: "
        fi
    fi
    
    print_success "Environment configured"
}

# Step 10: Create PM2 Config
step_create_pm2_config() {
    print_header "Step 10: Creating PM2 Configuration"
    
    cd ~/$PROJECT_NAME
    
    if [ ! -f ecosystem.config.js ]; then
        cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'securekasir-backend',
      script: './index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
EOF
        print_success "PM2 config created"
    fi
}

# Step 11: Setup PM2 Startup
step_setup_pm2_startup() {
    print_header "Step 11: Setting Up PM2 Startup Scripts"
    
    cd ~/$PROJECT_NAME
    mkdir -p logs
    
    pm2 start ecosystem.config.js
    pm2 startup
    pm2 save
    
    print_success "PM2 startup configured"
}

# Step 12: Configure Nginx
step_configure_nginx() {
    print_header "Step 12: Configuring Nginx"
    
    read -p "Enter your domain (or EC2 IP): " DOMAIN
    
    sudo tee /etc/nginx/sites-available/securekasir > /dev/null << EOF
upstream securekasir_backend {
    server 127.0.0.1:$APP_PORT;
}

server {
    listen 80;
    server_name $DOMAIN;
    client_max_body_size 10M;

    location / {
        proxy_pass http://securekasir_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        proxy_pass http://securekasir_backend;
        access_log off;
    }
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/securekasir /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    sudo nginx -t
    sudo systemctl restart nginx
    
    print_success "Nginx configured for $DOMAIN"
}

# Step 13: Setup SSL
step_setup_ssl() {
    print_header "Step 13: Setting Up SSL Certificate"
    
    read -p "Do you want to setup SSL with Let's Encrypt? (y/n): " SETUP_SSL
    
    if [ "$SETUP_SSL" = "y" ]; then
        read -p "Enter your domain: " DOMAIN
        read -p "Enter your email: " EMAIL
        
        sudo certbot certonly --nginx -d $DOMAIN -m $EMAIL --agree-tos --non-interactive
        
        # Update Nginx config for HTTPS
        sudo tee /etc/nginx/sites-available/securekasir > /dev/null << EOF
upstream securekasir_backend {
    server 127.0.0.1:$APP_PORT;
}

server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    client_max_body_size 10M;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://securekasir_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        proxy_pass http://securekasir_backend;
        access_log off;
    }
}
EOF
        
        sudo nginx -t
        sudo systemctl restart nginx
        
        print_success "SSL certificate installed and Nginx configured"
    fi
}

# Step 14: Setup Firewall
step_setup_firewall() {
    print_header "Step 14: Configuring Firewall (UFW)"
    
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw enable -y
    
    print_success "Firewall configured"
}

# Step 15: Verify Installation
step_verify_installation() {
    print_header "Step 15: Verifying Installation"
    
    echo ""
    print_info "Checking Node.js:"
    node --version
    
    print_info "Checking npm:"
    npm --version
    
    print_info "Checking PM2:"
    pm2 --version
    
    print_info "Checking Nginx:"
    sudo systemctl status nginx | grep Active
    
    print_info "PM2 Status:"
    pm2 status
    
    echo ""
    print_success "Installation completed!"
}

# Main execution
main() {
    print_header "SecureKasir Backend AWS EC2 Setup Wizard"
    echo ""
    echo "This script will set up your Ubuntu 22.04 EC2 instance"
    echo ""
    
    read -p "Continue with setup? (y/n): " CONTINUE
    
    if [ "$CONTINUE" != "y" ]; then
        print_error "Setup cancelled"
        exit 1
    fi
    
    step_update_system
    step_install_nodejs
    step_install_pm2
    step_install_nginx
    step_install_certbot
    step_install_git
    step_clone_project
    step_install_dependencies
    step_setup_environment
    step_create_pm2_config
    step_setup_pm2_startup
    step_configure_nginx
    step_setup_ssl
    step_setup_firewall
    step_verify_installation
    
    echo ""
    print_header "🎉 Setup Complete!"
    echo ""
    print_success "Your SecureKasir Backend is now running!"
    echo ""
    echo "Useful commands:"
    echo "  View logs: pm2 logs securekasir-backend"
    echo "  Restart app: pm2 restart securekasir-backend"
    echo "  Monitor: pm2 monit"
    echo "  Nginx logs: sudo tail -f /var/log/nginx/error.log"
    echo ""
}

# Run main function
main
