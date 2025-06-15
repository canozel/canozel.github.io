// TerminalSimulator class for Ubuntu terminal animation
class TerminalSimulator {
    constructor() {
        this.commands = [
            {
                id: 'cmd1',
                lineId: 'line1',
                outputId: 'out1',
                command: 'whoami',
                output: 'Salih Can Özel',
                delay: 500
            },
            {
                id: 'cmd2',
                lineId: 'line2',
                outputId: 'out2',
                command: 'pwd',
                output: '/home/salihcan/istanbul',
                delay: 1000
            },
            {
                id: 'cmd3',
                lineId: 'line3',
                outputId: 'out3',
                command: 'cat about',
                output: 'Backend, frontend, DevOps and mobile development experience...<br>My passion for code, world travels and vision for the future are here.',
                delay: 1000
            },
            {
                id: 'cmd4',
                lineId: 'line4',
                outputId: 'out4',
                command: 'ls travels',
                output: '<a href="pages/travels.html" target="_blank">Coming soon...</a>',
                delay: 1000
            },
            {
                id: 'cmd5',
                lineId: 'line5',
                outputId: 'out5',
                command: 'ls projects',
                output: '<a href="pages/projects.html" target="_blank">Coming soon...</a>',
                delay: 1000
            }
        ];
        this.typeSpeed = 80;
        this.outputDelay = 800;
        this.currentIndex = 0;
        this.hasSeenAnimation = localStorage.getItem('terminalAnimationSeen') === 'true';
    }

    // Show all commands and outputs without animation
    showAllCommandsDirectly() {
        this.commands.forEach((cmd, index) => {
            // Show command line if not the first one
            if (cmd.lineId && cmd.lineId !== 'line1') {
                document.getElementById(cmd.lineId).style.display = 'block';
            }
            
            // Show command text
            document.getElementById(cmd.id).textContent = cmd.command;
            
            // Show output
            const outputElement = document.getElementById(cmd.outputId);
            outputElement.style.display = 'block';
            outputElement.innerHTML = `<div class="output">${cmd.output}</div>`;
        });
        
        // Show final prompt with cursor
        const finalLine = document.getElementById('final-line');
        finalLine.style.display = 'block';
        finalLine.innerHTML = '<span class="username">canozel</span><span class="prompt">@</span><span class="hostname">ubuntu</span><span class="prompt">:</span><span class="path">~</span><span class="prompt">$ </span><span class="cursor"></span>';
    }typeCommand(commandData, callback) {
        // Show the line if it's not the first one
        if (commandData.lineId && commandData.lineId !== 'line1') {
            document.getElementById(commandData.lineId).style.display = 'block';
        }

        // Type the command with callback
        const typeIt = new TypeIt(`#${commandData.id}`, {
            speed: this.typeSpeed,
            html: true,
            lifeLike: true,
            cursor: false, // Disable cursor after typing
            afterComplete: () => {
                if (callback) callback();
            }
        })
        .type(commandData.command)
        .go();
    }

    showOutput(commandData, callback) {
        setTimeout(() => {
            const outputElement = document.getElementById(commandData.outputId);
            outputElement.style.display = 'block';
            outputElement.innerHTML = `<div class="output">${commandData.output}</div>`;
            
            // Show output and next prompt simultaneously (like real Linux)
            if (callback) callback();
        }, 200); // Reduced delay for more realistic feel
    }    executeCommand(index) {
        if (index >= this.commands.length) {
            // All commands completed, show final prompt with cursor
            setTimeout(() => {
                const finalLine = document.getElementById('final-line');
                finalLine.style.display = 'block';
                finalLine.innerHTML = '<span class="username">canozel</span><span class="prompt">@</span><span class="hostname">ubuntu</span><span class="prompt">:</span><span class="path">~</span><span class="prompt">$ </span><span class="cursor"></span>';
                
                // Mark animation as seen
                localStorage.setItem('terminalAnimationSeen', 'true');
                  // Setup interactive mode after animation completes
                setTimeout(() => {
                    this.setupInteractiveMode();
                    this.startEncouragementSystem();
                    this.addBlinkingPromptEffect();
                }, 500);
            }, 500);
            return;
        }

        const commandData = this.commands[index];
        
        // Type command first
        this.typeCommand(commandData, () => {
            // After typing is complete, show output and next command simultaneously
            this.showOutput(commandData, () => {
                // Minimal delay before next command (like real Linux)
                setTimeout(() => {
                    this.executeCommand(index + 1);
                }, 300);
            });
        });
    }    start() {
        // Check if user has seen animation before
        if (this.hasSeenAnimation) {
            // Show all commands directly without animation
            this.showAllCommandsDirectly();
            // Setup interactive mode after showing commands
            setTimeout(() => {
                this.setupInteractiveMode();
                this.startEncouragementSystem();
                this.addBlinkingPromptEffect();
            }, 100);
        } else {
            // Run animation as usual
            setTimeout(() => {
                this.executeCommand(0);
            }, 500);
        }
    }    // Sarcastic responses for user commands
    getSarcasticResponse(command) {
        const responses = {
            'ls': [
                "Hmm, still looking for more folders? I already showed you travels and projects! 😏",
                "Seriously? You want me to list the same directories again? travels, projects... there! 🙄",
                "Oh wow, another 'ls'! Let me guess, you forgot what I showed you 2 seconds ago? 🤦‍♂️",
                "List directories AGAIN? Fine: travels, projects. Happy now? 😑"
            ],
            'pwd': [
                "Are you lost? You're still in /home/salihcan/istanbul, just like 5 seconds ago! 🙄",
                "Path check #47: Still /home/salihcan/istanbul. GPS broken? 🗺️",
                "Let me help: P-W-D means 'Print Working Directory'. You're STILL in istanbul! 📍",
                "Geographic update: You haven't moved! Still /home/salihcan/istanbul 🏠"
            ],
            'whoami': [
                "Identity crisis much? You're still Salih Can Özel, nothing changed! 😂",
                "Same person as before: Salih Can Özel. Did you hit your head? 🤕",
                "Unless you've been body-swapped, you're still Salih Can Özel! 👤",
                "Existential crisis? You're Salih Can Özel. Write it down if you keep forgetting! 📝"
            ],
            'cat about': [
                "Did you forget already? I literally just told you about my experience! 🤦‍♂️",
                "Memory like a goldfish? Here's the about info AGAIN... 🐠",
                "Oh, you want to read my bio for the 3rd time? Sure, knock yourself out! 📖",
                "About file contents (since you can't remember): Backend, frontend, DevOps... 🔄"
            ],
            'clear': [
                "Nice try! This isn't a real terminal, genius! 🤓",
                "Clear what exactly? This is a webpage, not your messy desktop! 🖥️",
                "You can't clear a portfolio website! This isn't bash, Einstein! 🧠",
                "Clear command failed: Reality.exe is not responding! 💻"
            ],
            'exit': [
                "Exit? Where are you going? This is a website, not a server! 😆",
                "Exit to where? Your browser's back button is up there! ⬆️",
                "Can't exit a portfolio! You're stuck here forever! Muahahaha! 👹",
                "Exit code 404: Reality not found! You're in a browser, buddy! 🌐"
            ],
            'sudo': [
                "Sudo? Really? You think you need root access to browse a portfolio? 🤭",
                "Sudo permission denied: You're not the admin of my website! 👑",
                "Nice try! I'm not giving you root access to my portfolio! 🔒",
                "Sudo: command not found in web browsers! Try being a regular user! 👤"
            ],
            'rm -rf /': [
                "Whoa there, destroyer! Trying to break my website? Not happening! 😈",
                "HALT! You can't delete the entire website! Security breach detected! 🚨",
                "rm -rf /? In your dreams! I'm not letting you nuke my portfolio! 💥",
                "Access denied! You think I'd let you delete everything? Amateur! 🛡️"
            ],
            'help': [
                "Help? The help is: this is a portfolio website, not bash! 🤷‍♂️",
                "Help manual: Step 1: Realize this is a website. Step 2: Enjoy the content! 📚",
                "Help.exe has stopped working! Try using your eyes to browse around! 👀",
                "Help command: Look around, click things, appreciate the design! ✨"
            ],
            'man': [
                "Manual? The manual is: look around and enjoy the content! 📖",
                "Man pages? This isn't Unix! The manual is: browse and have fun! 📄",
                "Manual not found! Try the ancient art of 'clicking around'! 🖱️",
                "Man command failed! User manual: Use your browser like a normal person! 👨‍💻"
            ],
            'cd': [
                "Change directory? You're on a webpage, not in a file system! 🗂️",
                "CD to where? This isn't a file manager! Click links like a civilized human! 🖱️",
                "Can't change directories in a browser! Try clicking the menu instead! 📁",
                "cd failed: No file system here, just beautiful web design! 🎨"
            ],
            'mkdir': [
                "Create folder? This isn't your personal storage space! 📁",
                "mkdir denied! You can't create directories on my website! 🚫",
                "New folder? What is this, Windows Explorer? This is a portfolio! 💼",
                "Folder creation failed: This is read-only web content! 📖"
            ],
            'vim': [
                "Vim? Are you trying to edit my code? Hands off! ✋",
                "Vi/Vim not found! Besides, you can't edit a live website! ⌨️",
                "Nice try! No text editors here! My code is perfect as-is! 💎",
                "Vim: Access denied! You're not getting into my source code! 🔐"
            ],
            'nano': [
                "Nano? What are you planning to edit exactly? 📝",
                "Nano editor not available! This website is read-only! 📄",
                "You can't edit my content! Nano your own files! ✏️",
                "Nano failed to load: Portfolio.exe is write-protected! 🛡️"
            ],
            'git': [
                "Git commands? Wrong repo, buddy! 🔄",
                "Git not initialized! This is a live website, not a repository! 📦",
                "Git status: You're viewing a portfolio, not managing code! 🌿",
                "Git push yourself to another terminal! This one's busy! 🚀"
            ],
            'npm': [
                "NPM? This is a static site, not a Node.js project! 📦",
                "Package.json not found! No dependencies to install here! 📋",
                "NPM install failed: This is vanilla HTML/CSS/JS! 🍦",
                "Node modules? We don't need no stinking modules! 🚫"
            ],
            'python': [
                "Python? Sorry, no snakes here! 🐍",
                "Python interpreter not found! This is JavaScript territory! 🌐",
                "Import error: Snake.py not in portfolio directory! 🔍",
                "Python: Command not found! Try JavaScript instead! ⚡"
            ],
            'node': [
                "Node.js? We're keeping things simple here! 🟢",
                "Node not required! Pure vanilla JavaScript powers this site! ⚡",
                "Server.js not found! This is client-side only! 💻",
                "Node runtime error: Browser.exe is already running! 🌍"
            ],
            'docker': [
                "Docker? We don't need containers for a simple website! 🐋",
                "Dockerfile not found! This site runs directly in your browser! 🌐",
                "Container startup failed: This is bare metal HTML! 💾",
                "Docker compose: Just me, myself, and CSS! No orchestration needed! 🎼"
            ],
            'ps': [
                "Process list? The only process here is you browsing my site! ⚙️",
                "PS command result: 1 user browsing, 1 awesome portfolio running! 📊",
                "Active processes: Browser.exe, Portfolio.css, You.exe! 💻",
                "Process status: Everything's running smoothly, unlike your commands! 🔄"
            ],
            'top': [
                "Top processes? Just you admiring my terminal skills! 📊",
                "CPU usage: 100% awesome portfolio, 0% useful commands! 💯",
                "Top command: You're at the top of my website already! 🏔️",
                "Process monitor: 1 confused user, 1 patient website! 📈"
            ],
            'history': [
                "Command history? Just scroll up and see what we already did! 📜",
                "History lesson: You tried random commands, I gave sarcastic replies! 🎭",
                "Bash history not found! This conversation IS the history! 💬",
                "Historical fact: You've been entertained by my responses! 📚"
            ],
            'date': [
                "The date? It's 2025, time to appreciate good web design! 📅",
                "Current date: Sometime in the future when portfolios are interactive! 🚀",
                "Date command: Time flies when you're having fun with terminals! ⏰",
                "Today's date: Perfect day to hire a skilled developer! 💼"
            ],
            'cal': [
                "Calendar? Time flies when you're browsing a cool portfolio! 🗓️",
                "Calendar.exe crashed! Too busy being amazed by this site! 📅",
                "Monthly view: Every day is a good day to check out my projects! 📆",
                "Calendar not found! Time is an illusion when browsing portfolios! ⏰"
            ],
            'uptime': [
                "Uptime? This site has been running smoothly since you opened it! ⏰",
                "System uptime: 100% awesome since page load! 💯",
                "Uptime status: Running on pure HTML magic! ✨",
                "Load average: High on creativity, low on bugs! 📊"
            ],
            'df': [
                "Disk space? It's the cloud, infinite space! ☁️",
                "Disk usage: 0% storage, 100% style! 💾",
                "Filesystem: Portal.fs mounted on /awesome/portfolio! 🌐",
                "Space available: Unlimited creativity, bounded only by imagination! 🚀"
            ],
            'free': [
                "Memory usage? Don't worry, I'm not eating your RAM! 💾",
                "Free memory: Enough to appreciate good design! 🧠",
                "RAM status: All memory allocated to being impressed! 💭",
                "Memory leak detected: You're leaking admiration for this site! 💧"
            ]
        };

        // Check for exact matches first
        const lowerCommand = command.toLowerCase();
        if (responses[lowerCommand]) {
            const responseArray = responses[lowerCommand];
            return responseArray[Math.floor(Math.random() * responseArray.length)];
        }

        // Check for partial matches
        for (let key in responses) {
            if (lowerCommand.includes(key)) {
                const responseArray = responses[key];
                return responseArray[Math.floor(Math.random() * responseArray.length)];
            }
        }

        // Default sarcastic response for unknown commands
        const defaultResponses = [
            `"${command}"? That's not a real command! Are you making stuff up? 🤨`,
            `Command not found: ${command}. Maybe try a real command next time? 😏`,
            `"${command}": command not found. Did you mean to type something useful? 🤔`,
            `Unknown command: "${command}". This isn't a Linux quiz! 🎯`,
            `"${command}"? Creative, but this isn't bash! Try browsing instead! 🌐`,
            `Error: "${command}" is not recognized. Stick to what I already showed you! ⚠️`,
            `Command "${command}" failed: Creativity.exe has stopped working! 💻`,
            `Invalid syntax: "${command}". This is a portfolio, not a terminal! 🖥️`
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Handle user input
    setupInteractiveMode() {
        const finalLine = document.getElementById('final-line');
        let isInputMode = false;
        let currentCommand = '';

        // Create hidden input for capturing keystrokes
        const hiddenInput = document.createElement('input');
        hiddenInput.style.position = 'absolute';
        hiddenInput.style.left = '-9999px';
        hiddenInput.style.opacity = '0';
        document.body.appendChild(hiddenInput);

        // Focus hidden input when user clicks on terminal
        document.getElementById('terminal').addEventListener('click', () => {
            hiddenInput.focus();
        });

        // Handle keypress events
        hiddenInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentCommand.trim()) {
                    this.executeUserCommand(currentCommand.trim());
                    currentCommand = '';
                    this.updatePromptDisplay('');
                }
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                currentCommand = currentCommand.slice(0, -1);
                this.updatePromptDisplay(currentCommand);
            } else if (e.key.length === 1) {
                e.preventDefault();
                currentCommand += e.key;
                this.updatePromptDisplay(currentCommand);
            }
        });

        // Auto-focus hidden input
        hiddenInput.focus();
    }

    // Update the prompt display with current command
    updatePromptDisplay(command) {
        const finalLine = document.getElementById('final-line');
        finalLine.innerHTML = `<span class="username">canozel</span><span class="prompt">@</span><span class="hostname">ubuntu</span><span class="prompt">:</span><span class="path">~</span><span class="prompt">$ </span><span class="command">${command}</span><span class="cursor"></span>`;
    }    // Execute user command and show sarcastic response
    executeUserCommand(command) {
        // Mark that user has learned to type commands
        localStorage.setItem('userHasTypedCommands', 'true');
        
        const terminal = document.getElementById('terminal');
        const response = this.getSarcasticResponse(command);

        // Add the command line
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<span class="username">canozel</span><span class="prompt">@</span><span class="hostname">ubuntu</span><span class="prompt">:</span><span class="path">~</span><span class="prompt">$ </span><span class="command">${command}</span>`;
        terminal.appendChild(commandLine);

        // Add the sarcastic response
        const responseLine = document.createElement('div');
        responseLine.innerHTML = `<div class="output">${response}</div>`;
        terminal.appendChild(responseLine);

        // Add new prompt
        const newPrompt = document.createElement('div');
        newPrompt.id = 'final-line';
        newPrompt.innerHTML = '<span class="username">canozel</span><span class="prompt">@</span><span class="hostname">ubuntu</span><span class="prompt">:</span><span class="path">~</span><span class="prompt">$ </span><span class="cursor"></span>';
        terminal.appendChild(newPrompt);

        // Remove old final line
        const oldFinalLine = document.getElementById('final-line');
        if (oldFinalLine && oldFinalLine !== newPrompt) {
            oldFinalLine.remove();
        }

        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }// Encourage user to type with hints and prompts
    startEncouragementSystem() {
        // Check if user has already typed commands
        if (localStorage.getItem('userHasTypedCommands') === 'true') {
            return; // User already knows how to use it, no need for hints
        }

        let hintCount = 0;
        let hintInterval;
        const hints = [
            "💡 Try typing 'help' to see what I can do!",
            "🤔 Wonder what happens if you type 'sudo'?",
            "😏 Type 'clear' and see my reaction!",
            "🐍 Curious about 'python'? Give it a try!",
            "🔄 What about 'git status'? I dare you!",
            "📦 Try 'npm install' for a surprise!",
            "🐋 Type 'docker run' and watch me respond!",
            "✨ Be creative! Type any Linux command!",
            "🎯 Challenge me with 'rm -rf /' if you dare!",
            "⌨️ The terminal is waiting for your input..."
        ];

        const showHint = () => {
            // Stop showing hints if user has already typed
            if (localStorage.getItem('userHasTypedCommands') === 'true') {
                if (hintInterval) {
                    clearTimeout(hintInterval);
                }
                return;
            }

            if (hintCount < hints.length) {
                const terminal = document.getElementById('terminal');
                const hintElement = document.createElement('div');
                hintElement.innerHTML = `<div class="hint">${hints[hintCount]}</div>`;
                hintElement.style.opacity = '0';
                hintElement.style.transition = 'opacity 0.5s ease-in-out';
                
                // Insert before final line
                const finalLine = document.getElementById('final-line');
                terminal.insertBefore(hintElement, finalLine);
                
                // Fade in
                setTimeout(() => {
                    hintElement.style.opacity = '1';
                }, 100);
                
                // Fade out after 3 seconds
                setTimeout(() => {
                    hintElement.style.opacity = '0';
                    setTimeout(() => {
                        if (hintElement.parentNode) {
                            hintElement.remove();
                        }
                    }, 500);
                }, 3000);
                
                hintCount++;
                
                // Schedule next hint
                if (hintCount < hints.length) {
                    hintInterval = setTimeout(showHint, 8000); // Show hint every 8 seconds
                }
            }
        };

        // Start showing hints after 5 seconds of inactivity
        setTimeout(showHint, 5000);
    }

    // Add blinking prompt effect
    addBlinkingPromptEffect() {
        const finalLine = document.getElementById('final-line');
        if (finalLine) {
            finalLine.style.animation = 'pulse 2s infinite';
        }
    }

    // Add typing sound effect simulation
    simulateTypingSounds() {
        let isTyping = false;
        
        const playTypingSound = () => {
            // Visual feedback for typing
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cursor.style.transform = 'scale(1)';
                }, 100);
            }
        };

        // Override the keydown handler to add typing effects
        const originalKeydownHandler = this.setupInteractiveMode;
        this.setupInteractiveMode = function() {
            originalKeydownHandler.call(this);
            
            // Add typing sound visual effect
            const hiddenInput = document.querySelector('input[style*="opacity: 0"]');
            if (hiddenInput) {
                hiddenInput.addEventListener('input', playTypingSound);
            }
        }.bind(this);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const terminal = new TerminalSimulator();
    terminal.start();
});
