pipeline {
    agent any
    
    environment {
        ANSIBLE_HOST_KEY_CHECKING = 'False'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Verify Files') {
            steps {
                script {
                    echo 'Verifying required files exist...'
                    sh '''
                        ls -la
                        echo "Checking for docker-compose.yml..."
                        test -f docker-compose.yml && echo "✓ docker-compose.yml found" || echo "✗ docker-compose.yml missing"
                        echo "Checking for deploy.yml..."
                        test -f deploy.yml && echo "✓ deploy.yml found" || echo "✗ deploy.yml missing"
                    '''
                }
            }
        }
        
        stage('Deploy with Ansible') {
            steps {
                echo 'Deploying application using Ansible...'
                ansiblePlaybook(
                    playbook: 'deploy.yml',
                    inventory: 'hosts.ini',
                    colorized: true,
                    disableHostKeyChecking: true
                )
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Checking if containers are running...'
                    sh '''
                        cd /opt/event-board
                        docker-compose ps
                        echo "Deployment completed!"
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Deployment successful! Your Event Board is now running.'
        }
        failure {
            echo '❌ Deployment failed. Check the logs above for errors.'
        }
    }
}