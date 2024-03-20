const { exec, spawn } = require('child_process');

async function pullChangesAndStart() {
  try {
    // Pull changes from the Git repository
    await runCommand('git', ['pull']);
    // Compile TS Code
    await runCommand('npx', ['tsc']);

    // Start the index.js file in another Node process
    const childProcess = spawn('node', ['build/index.js']);

    childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  });
}

// Call the function to pull changes and start index.js
pullChangesAndStart().catch((error) => {
  console.error('An unhandled error occurred:', error);
});
