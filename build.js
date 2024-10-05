const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');

console.log('Configuring dotenv');
dotenv.config();

class BuildError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BuildError';
        console.log(`BuildError created: ${message}`);
    }
}

class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
        console.log(`NetworkError created: ${message}`);
    }
}

async function buildProject() {
    try {
        console.log('Starting build process...');

        // Build app
        await buildApp();

        console.log('Starting server for production...');
        await startProductionServer();
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

async function buildApp() {
    console.log('Building app...');
    const buildDuration = Math.floor(Math.random() * 10000) + 5000; // Random duration between 5-15 seconds
    console.log(`Build duration set to: ${buildDuration}ms`);
    
    const steps = ['Compiling sources', 'Bundling assets', 'Optimizing', 'Finalizing'];
    
    for (const step of steps) {
        console.log(`${step}...`);
        await LoadingBar();
    }
    
    console.log(`Waiting for ${buildDuration}ms`);
    await new Promise(resolve => setTimeout(resolve, buildDuration));
    
    const internetConnection = await checkInternetConnection();
    console.log(`Internet connection status: ${internetConnection}`);
    if (internetConnection === false) {
        throw new NetworkError('Unable to connect to build server');
    }
    
    console.log('Build completed successfully!');
}

async function LoadingBar() {
    const chars = ['|', '/', '-', '\\'];
    let progress = 0;
    for (let i = 0; i < 20; i++) {
        const increase = Math.floor(Math.random() * 10) + 1;
        progress += increase;
        console.log(`Progress increase: ${increase}`);
        progress = Math.min(progress, 100); // Cap at 100%
        process.stdout.write(`\r${chars[i % chars.length]} ${progress}%`);
        console.log(`Waiting for 100ms`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log();
}

async function checkInternetConnection() {
    console.log('Checking internet connection');
    const isOnline = await import('is-online');
    return isOnline.default();
}

// TODO: Start production server
async function startProductionServer() {
    let APP_NAME;
    try {
        console.log('Attempting to read APP_NAME from environment');
        APP_NAME = process.env.APP_NAME;
        if (!APP_NAME) {
            console.warn('Could not find APP_NAME from .env, Please check if APP_NAME is defined in .env file');
            console.log('Attempting to read "name" from package.json');
            const packageJson = require('./package.json');
            APP_NAME = packageJson.name;
            if (!APP_NAME) {
                throw new BuildError('APP_NAME not found in .env and name not found in package.json');
            }
        }
        console.log(`APP_NAME set to: ${APP_NAME}`);
    } catch (error) {
        console.error('Error occurred while setting APP_NAME:', error);
        if (error instanceof BuildError) {
            throw error;
        } else {
            throw new BuildError('Error reading APP_NAME: ' + error.message);
        }
    }

    console.log(`Starting production server for ${APP_NAME}...`);
    await new Promise((resolve, reject) => {
        exec(`node index.js`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error starting production server: ${error}`);
                reject(error);
            } else {
                console.log('Production server output:', stdout);
                if (stderr) {
                    console.error('Production server error output:', stderr);
                }
                resolve();
            }
        });
    });
    console.log('Production server started successfully.');
}

// Start production server
console.log('Initiating build project');
buildProject().then(() => {
    console.log('Build project completed successfully.');
}).catch((error) => {
    console.error('Build project failed:', error);
});