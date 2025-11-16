// main/updateEnv.js

const fs = require('fs');
const path = require('path');

// Paths
const envExamplePath = path.join(__dirname, '.env.example');
const nodeEnvPath = path.join(__dirname, 'nodejs/.env');
const frontEnvPath = path.join(__dirname, 'front/src/environments/environment.prod.ts');
const frontEnvPathWithoutSSR = path.join(__dirname, 'front/src/environments/environment.ts');

// Parse env to object
function parseEnv(content) {
    const lines = content.split('\n');
    const env = {};
    lines.forEach(line => {
        if (!line || line.startsWith('#')) return;
        const [key, ...rest] = line.split('=');
        const value = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key) env[key.trim()] = value;
    });
    return env;
}

// Update only 2 constants
function updateFrontConstants(envVars) {
    if (!fs.existsSync(frontEnvPath)) {
        console.warn('environment.prod.ts not found:', frontEnvPath);
        return;
    }

    let content = fs.readFileSync(frontEnvPath, 'utf-8');

    // Only update these 2 lines
    // if (envVars['API_BASE_URL']) {
    //     content = content.replace(
    //         /const API_BASE_URL\s*=.*?;/,
    //         `const API_BASE_URL = '${envVars['API_BASE_URL'].replace(/\/$/, '')}';`
    //     );
    // }
    if (envVars['API_BASE_URL']) {
        content = content.replace(
            /const API_BASE_URL\s*=.*?;/,
            `const API_BASE_URL = '${envVars['API_BASE_URL']}';`
        );
    }

    if (envVars['FRONT_URL']) {
        content = content.replace(
            /const FRONT_URL\s*=.*?;/,
            `const FRONT_URL = '${envVars['FRONT_URL'].replace(/\/$/, '')}';`
        );
    }
	
	if (envVars['SUPERSET_BASE_URL']) {
        content = content.replace(
            /const SUPERSET_BASE_URL\s*=.*?;/,
            `const SUPERSET_BASE_URL = '${envVars['SUPERSET_BASE_URL'].replace(/\/$/, '')}';`
        );
    }

    fs.writeFileSync(frontEnvPath, content);
    fs.writeFileSync(frontEnvPathWithoutSSR, content);
    console.log('Only API_BASE_URL and FRONT_URL updated in environment.prod.ts');
}

// Write .env for node
function updateNodeEnv(envContent) {
    fs.writeFileSync(nodeEnvPath, envContent);
    console.log('node/.env updated');
}

// Main function
function main() {
    if (!fs.existsSync(envExamplePath)) {
        console.error('.env.example not found!');
        return;
    }

    const envContent = fs.readFileSync(envExamplePath, 'utf-8');
    const envVars = parseEnv(envContent);

    updateNodeEnv(envContent);
    updateFrontConstants(envVars);
}

module.exports = main;

if (require.main === module) {
    main();
}
