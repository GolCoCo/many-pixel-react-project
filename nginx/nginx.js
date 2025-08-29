const { exec } = require('child_process');

exec('nginx -g "daemon off;"', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing nginx: ${error}`);
        return;
    }
    console.log(`nginx stdout: ${stdout}`);
    console.error(`nginx stderr: ${stderr}`);
});
