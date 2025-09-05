// Cipher implementations and application logic
class CodeBreakerApp {
    constructor() {
        this.currentCipher = 'caesar';
        this.currentEncoded = '';
        this.currentDecoded = '';
        this.stats = {
            correct: 0,
            incorrect: 0,
            accuracy: 0
        };
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.updateCipherInfo();
        this.loadStats();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.closest('.tab-btn').dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Tutorial navigation
        document.querySelectorAll('.tutorial-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tutorialName = e.target.closest('.tutorial-btn').dataset.tutorial;
                this.switchTutorial(tutorialName);
            });
        });

        // Tutorial practice exercise - Caesar
        const practiceBtn = document.getElementById('check-practice');
        if (practiceBtn) {
            practiceBtn.addEventListener('click', () => {
                this.checkTutorialPractice();
            });
        }

        const practiceInput = document.getElementById('practice-input');
        if (practiceInput) {
            practiceInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkTutorialPractice();
                }
            });
        }

        // Tutorial practice exercise - Baconian
        const baconianPracticeBtn = document.getElementById('check-baconian-practice');
        if (baconianPracticeBtn) {
            baconianPracticeBtn.addEventListener('click', () => {
                this.checkBaconianTutorialPractice();
            });
        }

        const baconianPracticeInput = document.getElementById('baconian-practice-input');
        if (baconianPracticeInput) {
            baconianPracticeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkBaconianTutorialPractice();
                }
            });
        }

        // Tutorial practice exercise - Vigenère
        const vigenerePracticeBtn = document.getElementById('check-vigenere-practice');
        if (vigenerePracticeBtn) {
            vigenerePracticeBtn.addEventListener('click', () => {
                this.checkVigenereTutorialPractice();
            });
        }

        const vigenerePracticeInput = document.getElementById('vigenere-practice-input');
        if (vigenerePracticeInput) {
            vigenerePracticeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkVigenereTutorialPractice();
                }
            });
        }

        // Tutorial practice exercise - Binary
        const binaryPracticeBtn = document.getElementById('check-binary-practice');
        if (binaryPracticeBtn) {
            binaryPracticeBtn.addEventListener('click', () => {
                this.checkBinaryTutorialPractice();
            });
        }

        const binaryPracticeInput = document.getElementById('binary-practice-input');
        if (binaryPracticeInput) {
            binaryPracticeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkBinaryTutorialPractice();
                }
            });
        }

        // Cipher selection
        document.querySelectorAll('.cipher-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCipher(e.target.closest('.cipher-btn').dataset.cipher);
            });
        });

        // Generate button
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateNewCode();
            });
        }

        // Check answer button
        document.getElementById('check-btn').addEventListener('click', () => {
            this.checkAnswer();
        });

        // Enter key in input
        document.getElementById('decoded-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });

        // Hint button
        const hintBtn = document.getElementById('get-hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.showHint();
            });
        }

        // Cipher info button
        const cipherBtn = document.getElementById('cipher-intro-btn');
        if (cipherBtn) {
            cipherBtn.addEventListener('click', () => {
                this.showCipherInfo();
            });
        }

        // Frequent letters button
        const freqBtn = document.getElementById('freq-letters-btn');
        if (freqBtn) {
            freqBtn.addEventListener('click', () => {
                this.showFrequentLetters();
            });
        }

        // Note: Modal functionality removed - all info now displays in hint area

        // Difficulty change
        document.getElementById('difficulty').addEventListener('change', () => {
            this.generateNewCode();
        });

        // Test button (for debugging)
        if (window.userEmail === 'senhua.huang@gmail.com') {
            const testBtn = document.createElement('button');
            testBtn.textContent = '🧪 Test Ciphers';
            testBtn.className = 'test-btn';
            testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #ff6b6b; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; z-index: 1000;';
            testBtn.addEventListener('click', () => this.runTests());
            document.body.appendChild(testBtn);
        }
    }

    selectCipher(cipherType) {
        console.log('Selecting cipher:', cipherType);
        this.currentCipher = cipherType;
        
        // Update active button
        document.querySelectorAll('.cipher-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-cipher="${cipherType}"]`).classList.add('active');
        
        this.updateCipherInfo();
        this.generateNewCode(true); // Pass true to force new word
    }

    updateCipherInfo() {
        const cipherInfo = {
            caesar: {
                name: 'Caesar Cipher',
                description: 'Shift each letter by a fixed number of positions in the alphabet.'
            },
            atbash: {
                name: 'Atbash Cipher',
                description: 'Replace each letter with its opposite in the alphabet (A↔Z, B↔Y, etc.).'
            },
            keyword: {
                name: 'Keyword Cipher',
                description: 'Use a keyword to create a substitution alphabet.'
            },
            vigenere: {
                name: 'Vigenère Cipher',
                description: 'Use a repeating keyword to shift letters by different amounts.'
            },
            morse: {
                name: 'Morse Code',
                description: 'Convert letters to dots and dashes using Morse code.'
            },
            binary: {
                name: 'Binary Code',
                description: 'Convert letters to their binary representation (A=01000001).'
            },
            aristocrats: {
                name: 'Aristocrats',
                description: 'A monoalphabetic substitution cipher (cryptogram) with spaces and punctuation preserved.'
            },
            affine: {
                name: 'Affine Cipher',
                description: 'A substitution cipher using the formula E(x) = (ax + b) mod 26, where a and b are keys.'
            },
            baconian: {
                name: 'Baconian Cipher',
                description: 'Each letter is encoded as a 5-bit binary string using A and B. In hard mode, numbers are supported with 6-bit codes.'
            },
            polybius: {
                name: 'Polybius Square',
                description: 'Letters are encoded using a 5x5 grid with row and column numbers (A=11, B=12, etc.).'
            }
        };

        const info = cipherInfo[this.currentCipher];
        document.getElementById('cipher-name').textContent = info.name;
        document.getElementById('cipher-description').textContent = info.description;
    }

    generateNewCode(forceNewWord = false) {
        const difficulty = document.getElementById('difficulty').value;
        const wordList = this.getWordList(difficulty);
        
        if (!wordList || wordList.length === 0) {
            console.error('No word list found for difficulty:', difficulty);
            document.getElementById('encoded-text').textContent = 'Error: No words available for this difficulty';
            return;
        }
        
        let randomWord;
        do {
            randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        } while (forceNewWord && randomWord.toUpperCase() === this.currentDecoded);
        
        // For expert mode (sentences), preserve original case and punctuation
        if (difficulty === 'expert') {
            this.currentDecoded = randomWord; // Keep original case for display
            this.currentEncoded = this.encodeText(randomWord);
        } else {
            // For word modes, convert to uppercase
            this.currentDecoded = randomWord.toUpperCase();
            this.currentEncoded = this.encodeText(randomWord.toUpperCase());
        }
        
        console.log('Generated new code:', {
            cipher: this.currentCipher,
            decoded: this.currentDecoded,
            encoded: this.currentEncoded
        });
        document.getElementById('encoded-text').textContent = this.currentEncoded;
        document.getElementById('decoded-input').value = '';
        document.getElementById('result').className = 'result';
        document.getElementById('hint-text').className = 'hint-text';
        
        // Clear previous result
        setTimeout(() => {
            document.getElementById('result').innerHTML = '';
        }, 300);
    }

    getWordList(difficulty) {
        const wordLists = {
            easy: [
                // Science Olympiad themed basic words
                'CODE', 'TEAM', 'TEST', 'GOLD', 'STAR', 'BLUE', 'GAME', 'HOPE', 'FACT', 'IDEA',
                'ATOM', 'CELL', 'GENE', 'BONE', 'ACID', 'BASE', 'ROCK', 'MOON', 'MARS', 'QUIZ'
            ],
            medium: [
                // CodeBusters competition terms and Science Olympiad vocabulary
                'CIPHER', 'DECODE', 'ENCODE', 'CAESAR', 'ATBASH', 'MORSE', 'BINARY', 'SHIFT',
                'OLYMPIAD', 'SCIENCE', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'GEOLOGY', 'ASTRONOMY', 'ECOLOGY'
            ],
            hard: [
                // Advanced Science Olympiad competition vocabulary
                'CRYPTOGRAPHY', 'SUBSTITUTION', 'TRANSPOSITION', 'FREQUENCY', 'ANALYSIS', 'POLYALPHABETIC',
                'MONOALPHABETIC', 'VIGENERE', 'ARISTOCRATS', 'BACONIAN', 'POLYBIUS', 'CRYPTANALYSIS',
                // Science Olympiad themed words with numbers for Baconian cipher practice
                'TEAM1', 'GOLD2025', 'EVENT15', 'DIV3', 'TEST42', 'AWARD1ST', 'RANK10', 'SCORE100'
            ],
            expert: [
                // Science Olympiad themed sentences and common practice phrases
                'The quick brown fox jumps over the lazy dog.',
                'Science Olympiad is the premier STEM competition.',
                'Practice makes perfect in CodeBusters.',
                'Frequency analysis helps decode substitution ciphers.',
                'Good teams collaborate to solve challenging problems.',
                'Study hard and compete with honor and integrity.'
            ]
        };
        return wordLists[difficulty];
    }

    encodeText(text) {
        switch (this.currentCipher) {
            case 'caesar':
                return this.caesarEncode(text);
            case 'atbash':
                return this.atbashEncode(text);
            case 'keyword':
                return this.keywordEncode(text);
            case 'vigenere':
                return this.vigenereEncode(text);
            case 'morse':
                return this.morseEncode(text);
            case 'binary':
                return this.binaryEncode(text);
            case 'aristocrats':
                return this.aristocratsEncode(text);
            case 'affine':
                return this.affineEncode(text);
            case 'baconian':
                return this.baconianEncode(text);
            case 'polybius':
                return this.polybiusEncode(text);
            default:
                return text;
        }
    }

    caesarEncode(text) {
        const shift = Math.floor(Math.random() * 25) + 1; // Random shift 1-25
        this.currentShift = shift; // Store for hints
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
            }
            return char;
        }).join('');
    }

    atbashEncode(text) {
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
            } else if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
            }
            return char;
        }).join('');
    }

    keywordEncode(text) {
        const keywords = ['SCIENCE', 'OLYMPIAD', 'BREAKER', 'CIPHER'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        
        // Create substitution alphabet
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const keywordUnique = [...new Set(keyword.split(''))].join('');
        const remaining = alphabet.split('').filter(char => !keywordUnique.includes(char)).join('');
        const substitution = keywordUnique + remaining;
        
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const index = alphabet.indexOf(char);
                return substitution[index];
            } else if (char >= 'a' && char <= 'z') {
                const index = alphabet.indexOf(char.toUpperCase());
                return substitution[index].toLowerCase();
            }
            return char;
        }).join('');
    }

    vigenereEncode(text) {
        const keywords = ['KEY', 'CODE', 'SECRET', 'CIPHER'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        
        let letterIndex = 0; // Track position in keyword (skip non-letters)
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const textChar = char.charCodeAt(0) - 65;
                const keyChar = keyword[letterIndex % keyword.length].charCodeAt(0) - 65;
                letterIndex++;
                return String.fromCharCode(((textChar + keyChar) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                const textChar = char.charCodeAt(0) - 97;
                const keyChar = keyword[letterIndex % keyword.length].charCodeAt(0) - 65;
                letterIndex++;
                return String.fromCharCode(((textChar + keyChar) % 26) + 97);
            }
            return char;
        }).join('');
    }

    morseEncode(text) {
        const morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', ' ': '/'
        };
        
        return text.split('').map(char => {
            const upperChar = char.toUpperCase();
            if (morseCode[upperChar]) {
                return morseCode[upperChar];
            }
            return char === ' ' ? '/' : '';
        }).filter(code => code !== '').join(' ');
    }

    binaryEncode(text) {
        return text.split('').map(char => {
            // Handle all printable ASCII characters, not just uppercase letters
            if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || char === ' ' || /[.,!?;:'-]/.test(char)) {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }
            return char.charCodeAt(0).toString(2).padStart(8, '0'); // Encode all characters
        }).join(' ');
    }

    aristocratsEncode(text) {
        // Generate random monoalphabetic substitution
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let shuffled = alphabet.split('');
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        this.aristocratsKey = {};
        for (let i = 0; i < 26; i++) {
            this.aristocratsKey[alphabet[i]] = shuffled[i];
        }
        // Encode with mixed case support
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return this.aristocratsKey[char];
            } else if (char >= 'a' && char <= 'z') {
                const upperChar = char.toUpperCase();
                return this.aristocratsKey[upperChar].toLowerCase();
            }
            return char; // Preserve spaces, punctuation, etc.
        }).join('');
    }
    aristocratsDecode(text) {
        // Reverse the key
        if (!this.aristocratsKey) return text;
        const reverseKey = {};
        for (const k in this.aristocratsKey) {
            reverseKey[this.aristocratsKey[k]] = k;
        }
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return reverseKey[char];
            }
            return char;
        }).join('');
    }
    affineEncode(text) {
        // Pick random a coprime with 26, and b
        const coprimes = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
        const a = coprimes[Math.floor(Math.random() * coprimes.length)];
        const b = Math.floor(Math.random() * 26);
        this.affineA = a;
        this.affineB = b;
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const x = char.charCodeAt(0) - 65;
                return String.fromCharCode(((a * x + b) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                const x = char.charCodeAt(0) - 97;
                return String.fromCharCode(((a * x + b) % 26) + 97);
            }
            return char; // Preserve spaces, punctuation, etc.
        }).join('');
    }
    affineDecode(text) {
        // Find modular inverse of a
        const a = this.affineA;
        const b = this.affineB;
        let a_inv = null;
        for (let i = 1; i < 26; i++) {
            if ((a * i) % 26 === 1) {
                a_inv = i;
                break;
            }
        }
        if (!a_inv) return text;
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const y = char.charCodeAt(0) - 65;
                return String.fromCharCode(((a_inv * (y - b + 26)) % 26) + 65);
            }
            return char;
        }).join('');
    }

    baconianEncode(text) {
        // Baconian cipher: A=AAAAA, B=AAAAB, C=AAABA, etc.
        const difficulty = document.getElementById('difficulty').value;
        const baconianTable = {
            'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
            'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAB',
            'K': 'ABABA', 'L': 'ABABB', 'M': 'ABBAA', 'N': 'ABBAB', 'O': 'ABBBA',
            'P': 'ABBBB', 'Q': 'BAAAA', 'R': 'BAAAB', 'S': 'BAABA', 'T': 'BAABB',
            'U': 'BABAA', 'V': 'BABAB', 'W': 'BABBA', 'X': 'BABBB', 'Y': 'BBAAA', 'Z': 'BBAAB'
        };
        
        // Add numbers for hard difficulty using 6-bit codes to avoid conflicts
        if (difficulty === 'hard' || difficulty === 'expert') {
            Object.assign(baconianTable, {
                '0': 'BBBAAA', '1': 'BBBAAB', '2': 'BBBABA', '3': 'BBBABB', '4': 'BBBBAA',
                '5': 'BBBBAB', '6': 'BBBBBA', '7': 'BBBBBB', '8': 'AAABBB', '9': 'AABBBB'
            });
        }
        
        return text.split('').map(char => {
            const upperChar = char.toUpperCase();
            if (baconianTable[upperChar] || baconianTable[char]) {
                return baconianTable[upperChar] || baconianTable[char];
            }
            return char === ' ' ? '/' : ''; // Use / for spaces, skip other chars
        }).filter(code => code !== '').join(' ');
    }

    polybiusEncode(text) {
        // Polybius Square: 5x5 grid (I/J combined)
        const polybiusTable = {
            'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
            'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24',
            'K': '25', 'L': '31', 'M': '32', 'N': '33', 'O': '34',
            'P': '35', 'Q': '41', 'R': '42', 'S': '43', 'T': '44',
            'U': '45', 'V': '51', 'W': '52', 'X': '53', 'Y': '54', 'Z': '55'
        };
        
        return text.split('').map(char => {
            const upperChar = char.toUpperCase();
            if (polybiusTable[upperChar]) {
                return polybiusTable[upperChar];
            }
            return char === ' ' ? '/' : ''; // Use / for spaces, skip other chars
        }).filter(code => code !== '').join(' ');
    }

    checkAnswer() {
        const userAnswer = document.getElementById('decoded-input').value.trim();
        const resultDiv = document.getElementById('result');
        const difficulty = document.getElementById('difficulty').value;
        
        // For expert mode, compare with original case; for others, convert to uppercase
        const normalizedUserAnswer = difficulty === 'expert' ? userAnswer : userAnswer.toUpperCase();
        const normalizedCorrectAnswer = difficulty === 'expert' ? this.currentDecoded : this.currentDecoded.toUpperCase();
        
        if (normalizedUserAnswer === normalizedCorrectAnswer) {
            resultDiv.innerHTML = '<i class="fas fa-check-circle"></i> Correct! Great job!';
            resultDiv.className = 'result correct show';
            this.stats.correct++;
            this.updateStats();
            this.saveStats();
            
            // Update server stats if user is logged in
            this.updateServerStats(1, 1);
            
            // Generate new code after a short delay
            setTimeout(() => {
                this.generateNewCode();
            }, 2000);
        } else {
            resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect. Try again!';
            resultDiv.className = 'result incorrect show';
            this.stats.incorrect++;
            this.updateStats();
            this.saveStats();
            
            // Update server stats if user is logged in
            this.updateServerStats(1, 0);
        }
        
        resultDiv.classList.add('bounce');
        setTimeout(() => {
            resultDiv.classList.remove('bounce');
        }, 600);
    }

    updateServerStats(attempts, correct) {
        // Check if user is logged in by looking for user profile elements
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            fetch('/api/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    attempts: attempts,
                    correct: correct,
                    favorite_cipher: this.currentCipher
                })
            })
            .then(response => response.json())
            .then(data => {
                // Update local stats with server data
                this.stats.correct = data.correct_answers;
                this.stats.incorrect = data.total_attempts - data.correct_answers;
                this.updateStats();
            })
            .catch(error => {
                console.log('Error updating server stats:', error);
            });
        }
    }

    showHint() {
        const hintText = document.getElementById('hint-text');
        const hints = {
            caesar: `In Science Olympiad, try shifts 3, 5, 13 (ROT13) first - these are most common. Current shift: ${this.currentShift || 'try different values'}. Count forward/backward in alphabet.`,
            atbash: 'CodeBusters tip: A=Z, B=Y, C=X... Write the alphabet backwards underneath the normal alphabet as your key.',
            keyword: 'Competition strategy: Look for the keyword in common Science Olympiad terms. Remove duplicate letters, then add remaining alphabet letters.',
            vigenere: 'Science Olympiad hint: Find the keyword length first by looking for repeated patterns. Each position uses a different Caesar shift.',
            morse: 'CodeBusters standard: Dots(.) and dashes(-). E=dot, T=dash. Single space between letters, double space between words.',
            binary: 'Science Olympiad tip: Each letter is 8 bits (ASCII). A=01000001, B=01000010. Convert binary to decimal, then to letter.',
            aristocrats: 'Competition strategy: Start with single letters (A/I), common words (THE, AND, OF). Use English letter frequency: ETAOINSHRDLU.',
            affine: `Mathematical cipher: E(x) = (ax + b) mod 26. Current a=${this.affineA || '?'}, b=${this.affineB || '?'}. In competitions, a must be coprime with 26.`,
            baconian: 'CodeBusters tip: Each letter becomes 5 A/B characters. A=AAAAA, B=AAAAB, C=AAABA. In hard mode, numbers use 6 characters (0=BBBAAA, 1=BBBAAB, etc). Group encoded text by character length.',
            polybius: 'Science Olympiad strategy: Use 5x5 grid (I/J share 24). First digit = row, second = column. A=11, B=12, C=13, etc.'
        };
        
        const hintMessage = hints[this.currentCipher] || `No hint available for ${this.currentCipher}`;
        
        if (hintText) {
            hintText.textContent = `💡 HINT: ${hintMessage}`;
            hintText.className = 'hint-text show hint';
        }
    }

    showCipherInfo() {
        const hintText = document.getElementById('hint-text');
        const intro = cipherIntroductions[this.currentCipher];
        
        if (intro && hintText) {
            const infoMessage = `ℹ️ ABOUT ${intro.title.toUpperCase()}: ${intro.body}`;
            hintText.textContent = infoMessage;
            hintText.className = 'hint-text show cipher-info';
        } else if (hintText) {
            const fallbackMessage = `ℹ️ ABOUT ${this.currentCipher || 'THIS CIPHER'}: Information not available.`;
            hintText.textContent = fallbackMessage;
            hintText.className = 'hint-text show cipher-info';
        }
    }

    showFrequentLetters() {
        const hintText = document.getElementById('hint-text');
        
        if (hintText) {
            const freqMessage = `📊 ENGLISH LETTER FREQUENCIES:
E (12.7%), T (9.1%), A (8.2%), O (7.5%), I (7.0%), N (6.7%), S (6.3%), H (6.1%), R (6.0%), D (4.3%), L (4.0%), U (2.8%), C (2.8%), M (2.4%), F (2.2%), W (2.1%), Y (2.0%), P (1.9%), V (1.0%), B (1.3%), G (2.0%), K (0.8%), J (0.15%), Q (0.10%), X (0.17%), Z (0.07%)

💡 Competition Tip: Most common letters are ETAOINSHRDLU. Look for single letters (A, I) and common 3-letter words (THE, AND).`;
            hintText.innerHTML = freqMessage.replace(/\n/g, '<br>');
            hintText.className = 'hint-text show freq-letters';
        }
    }

    updateStats() {
        const total = this.stats.correct + this.stats.incorrect;
        this.stats.accuracy = total > 0 ? Math.round((this.stats.correct / total) * 100) : 0;
        
        document.getElementById('correct-count').textContent = this.stats.correct;
        document.getElementById('incorrect-count').textContent = this.stats.incorrect;
        document.getElementById('accuracy').textContent = this.stats.accuracy + '%';
    }

    saveStats() {
        localStorage.setItem('codeBreakerStats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('codeBreakerStats');
        if (saved) {
            this.stats = JSON.parse(saved);
            this.updateStats();
        }
    }

    runTests() {
        console.log('🧪 Running Cipher Tests...\n');
        const testCases = [
            { input: 'HELLO', expected: 'HELLO' },
            { input: 'SCIENCE', expected: 'SCIENCE' },
            { input: 'OLYMPIAD', expected: 'OLYMPIAD' }
        ];
        const cipherTypes = ['caesar', 'atbash', 'keyword', 'vigenere', 'morse', 'binary', 'aristocrats', 'affine'];
        cipherTypes.forEach(cipherType => {
            console.log(`\n📋 Testing ${cipherType.toUpperCase()} Cipher:`);
            console.log('='.repeat(50));
            testCases.forEach(testCase => {
                const originalCipher = this.currentCipher;
                this.currentCipher = cipherType;
                let encoded, decoded, pass = false;
                if (cipherType === 'aristocrats') {
                    encoded = this.aristocratsEncode(testCase.input);
                    decoded = this.aristocratsDecode(encoded);
                    pass = decoded === testCase.input;
                } else if (cipherType === 'affine') {
                    encoded = this.affineEncode(testCase.input);
                    decoded = this.affineDecode(encoded);
                    pass = decoded === testCase.input;
                } else {
                    encoded = this.encodeText(testCase.input);
                    decoded = this.decodeText(encoded, cipherType);
                    pass = decoded === testCase.input;
                }
                console.log(`Input: ${testCase.input} | Encoded: ${encoded} | Decoded: ${decoded} | ${pass ? '✅ PASS' : '❌ FAIL'}`);
                this.currentCipher = originalCipher;
            });
        });
        console.log('\nAll tests complete.');
    }

    testCaesarWithShift(input, shift, expected) {
        const originalShift = this.currentShift;
        this.currentShift = shift;
        const result = this.caesarEncode(input);
        const success = result === expected;
        console.log(`Caesar "${input}" shift ${shift}: "${result}" ${success ? '✅' : '❌'} (expected: "${expected}")`);
        this.currentShift = originalShift;
    }

    testAtbash(input, expected) {
        const result = this.atbashEncode(input);
        const success = result === expected;
        console.log(`Atbash "${input}": "${result}" ${success ? '✅' : '❌'} (expected: "${expected}")`);
    }

    testMorse(input, expected) {
        const result = this.morseEncode(input);
        const success = result === expected;
        console.log(`Morse "${input}": "${result}" ${success ? '✅' : '❌'} (expected: "${expected}")`);
    }

    testBinary(input, expected) {
        const result = this.binaryEncode(input);
        const success = result === expected;
        console.log(`Binary "${input}": "${result}" ${success ? '✅' : '❌'} (expected: "${expected}")`);
    }

    decodeText(text, cipherType) {
        switch (cipherType) {
            case 'caesar':
                return this.caesarDecode(text);
            case 'atbash':
                return this.atbashDecode(text);
            case 'keyword':
                return this.keywordDecode(text);
            case 'vigenere':
                return this.vigenereDecode(text);
            case 'morse':
                return this.morseDecode(text);
            case 'binary':
                return this.binaryDecode(text);
            case 'aristocrats':
                return this.aristocratsDecode(text);
            case 'affine':
                return this.affineDecode(text);
            case 'baconian':
                return this.baconianDecode(text);
            case 'polybius':
                return this.polybiusDecode(text);
            default:
                return text;
        }
    }

    caesarDecode(text) {
        if (!this.currentShift) return text;
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((char.charCodeAt(0) - 65 - this.currentShift + 26) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(((char.charCodeAt(0) - 97 - this.currentShift + 26) % 26) + 97);
            }
            return char;
        }).join('');
    }

    atbashDecode(text) {
        return this.atbashEncode(text); // Atbash is self-reversible
    }

    keywordDecode(text) {
        // This is a simplified version - in practice, you'd need to know the keyword
        const keywords = ['SCIENCE', 'OLYMPIAD', 'BREAKER', 'CIPHER'];
        const keyword = keywords[0]; // Use first keyword for testing
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const keywordUnique = [...new Set(keyword.split(''))].join('');
        const remaining = alphabet.split('').filter(char => !keywordUnique.includes(char)).join('');
        const substitution = keywordUnique + remaining;
        
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const index = substitution.indexOf(char);
                return alphabet[index];
            } else if (char >= 'a' && char <= 'z') {
                const upperChar = char.toUpperCase();
                const index = substitution.indexOf(upperChar);
                return alphabet[index] ? alphabet[index].toLowerCase() : char;
            }
            return char;
        }).join('');
    }

    vigenereDecode(text) {
        // This is a simplified version - in practice, you'd need to know the keyword
        const keywords = ['KEY', 'CODE', 'SECRET', 'CIPHER'];
        const keyword = keywords[0]; // Use first keyword for testing
        
        let letterIndex = 0; // Track position in keyword (skip non-letters)
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const textChar = char.charCodeAt(0) - 65;
                const keyChar = keyword[letterIndex % keyword.length].charCodeAt(0) - 65;
                letterIndex++;
                return String.fromCharCode(((textChar - keyChar + 26) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                const textChar = char.charCodeAt(0) - 97;
                const keyChar = keyword[letterIndex % keyword.length].charCodeAt(0) - 65;
                letterIndex++;
                return String.fromCharCode(((textChar - keyChar + 26) % 26) + 97);
            }
            return char;
        }).join('');
    }

    morseDecode(text) {
        const morseCode = {
            '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
            '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
            '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
            '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
            '-.--': 'Y', '--..': 'Z'
        };
        return text.split(' ').map(code => morseCode[code] || code).join('');
    }

    binaryDecode(text) {
        return text.split(' ').map(binary => {
            const byte = parseInt(binary, 2);
            return String.fromCharCode(byte);
        }).join('');
    }

    aristocratsDecode(text) {
        // Reverse the key
        if (!this.aristocratsKey) return text;
        const reverseKey = {};
        for (const k in this.aristocratsKey) {
            reverseKey[this.aristocratsKey[k]] = k;
        }
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return reverseKey[char];
            } else if (char >= 'a' && char <= 'z') {
                const upperChar = char.toUpperCase();
                return reverseKey[upperChar] ? reverseKey[upperChar].toLowerCase() : char;
            }
            return char;
        }).join('');
    }

    affineDecode(text) {
        // Find modular inverse of a
        const a = this.affineA;
        const b = this.affineB;
        let a_inv = null;
        for (let i = 1; i < 26; i++) {
            if ((a * i) % 26 === 1) {
                a_inv = i;
                break;
            }
        }
        if (!a_inv) return text;
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                const y = char.charCodeAt(0) - 65;
                return String.fromCharCode(((a_inv * (y - b + 26)) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                const y = char.charCodeAt(0) - 97;
                return String.fromCharCode(((a_inv * (y - b + 26)) % 26) + 97);
            }
            return char;
        }).join('');
    }

    baconianDecode(text) {
        // Baconian cipher decode: AAAAA=A, AAAAB=B, etc.
        const difficulty = document.getElementById('difficulty').value;
        const baconianTable = {
            'AAAAA': 'A', 'AAAAB': 'B', 'AAABA': 'C', 'AAABB': 'D', 'AABAA': 'E',
            'AABAB': 'F', 'AABBA': 'G', 'AABBB': 'H', 'ABAAA': 'I', 'ABAAB': 'J',
            'ABABA': 'K', 'ABABB': 'L', 'ABBAA': 'M', 'ABBAB': 'N', 'ABBBA': 'O',
            'ABBBB': 'P', 'BAAAA': 'Q', 'BAAAB': 'R', 'BAABA': 'S', 'BAABB': 'T',
            'BABAA': 'U', 'BABAB': 'V', 'BABBA': 'W', 'BABBB': 'X', 'BBAAA': 'Y', 'BBAAB': 'Z'
        };
        
        // Add numbers for hard difficulty using 6-bit codes to avoid conflicts
        if (difficulty === 'hard' || difficulty === 'expert') {
            Object.assign(baconianTable, {
                'BBBAAA': '0', 'BBBAAB': '1', 'BBBABA': '2', 'BBBABB': '3', 'BBBBAA': '4',
                'BBBBAB': '5', 'BBBBBA': '6', 'BBBBBB': '7', 'AAABBB': '8', 'AABBBB': '9'
            });
        }
        
        return text.split(' ').map(code => {
            return baconianTable[code] || (code === '/' ? ' ' : code);
        }).join('');
    }

    polybiusDecode(text) {
        // Polybius Square decode
        const polybiusTable = {
            '11': 'A', '12': 'B', '13': 'C', '14': 'D', '15': 'E',
            '21': 'F', '22': 'G', '23': 'H', '24': 'I', '25': 'K',
            '31': 'L', '32': 'M', '33': 'N', '34': 'O', '35': 'P',
            '41': 'Q', '42': 'R', '43': 'S', '44': 'T', '45': 'U',
            '51': 'V', '52': 'W', '53': 'X', '54': 'Y', '55': 'Z'
        };
        
        return text.split(' ').map(code => {
            return polybiusTable[code] || (code === '/' ? ' ' : code);
        }).join('');
    }
}

// Cipher introductions - Science Olympiad CodeBusters focused
const cipherIntroductions = {
    caesar: {
        title: 'Caesar Cipher',
        body: 'A shift cipher commonly tested in Science Olympiad CodeBusters. Each letter shifts by the same amount (1-25). Practice tip: Try shifts of 13 (ROT13), 3, and 5 first as they are most common in competitions.'
    },
    atbash: {
        title: 'Atbash Cipher',
        body: 'A simple substitution cipher frequently appearing in CodeBusters Division B and C. A=Z, B=Y, C=X, etc. This monoalphabetic cipher preserves letter frequency patterns.'
    },
    keyword: {
        title: 'Keyword Cipher',
        body: 'A monoalphabetic substitution using a keyword, common in Science Olympiad. The keyword creates a cipher alphabet. Look for repeated patterns and use frequency analysis to solve.'
    },
    vigenere: {
        title: 'Vigenère Cipher',
        body: 'A polyalphabetic cipher using a repeating keyword, often tested in Division C CodeBusters. Each letter position uses a different Caesar shift based on the keyword letter.'
    },
    morse: {
        title: 'Morse Code',
        body: 'International Morse Code using dots (.) and dashes (-), standard in Science Olympiad CodeBusters. Each letter has a unique pattern. Spaces separate letters, double spaces separate words.'
    },
    binary: {
        title: 'Binary Code',
        body: 'ASCII binary representation (8 bits per character) commonly tested in CodeBusters. A=01000001, B=01000010, etc. Each byte represents one character.'
    },
    aristocrats: {
        title: 'Aristocrats Cipher',
        body: 'A monoalphabetic substitution cryptogram preserving word structure, frequently appearing in Science Olympiad Division B/C. Use frequency analysis and common English patterns to solve.'
    },
    affine: {
        title: 'Affine Cipher',
        body: 'A mathematical cipher using E(x) = (ax + b) mod 26, sometimes tested in advanced CodeBusters Division C. The value "a" must be coprime with 26 (1,3,5,7,9,11,15,17,19,21,23,25).'
    },
    baconian: {
        title: 'Baconian Cipher',
        body: 'Each letter encoded as 5-character A/B strings, commonly tested in Science Olympiad Division B/C. Francis Bacon invented this steganographic cipher. A=AAAAA, B=AAAAB, C=AAABA, etc.'
    },
    polybius: {
        title: 'Polybius Square',
        body: 'Letters encoded using 5x5 grid coordinates, frequent in CodeBusters competitions. I and J share position 24. Numbers represent row-column: A=11, B=12, C=13, K=25, etc.'
    }
};

// Add tab and tutorial functionality to the CodeBreakerApp class
CodeBreakerApp.prototype.switchTab = function(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // If switching to practice tab, auto-select Caesar cipher
    if (tabName === 'practice') {
        this.selectCipher('caesar');
    }
};

CodeBreakerApp.prototype.switchTutorial = function(tutorialName) {
    // Update active tutorial button
    document.querySelectorAll('.tutorial-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tutorial="${tutorialName}"]`).classList.add('active');

    // Update active tutorial content
    document.querySelectorAll('.tutorial-lesson').forEach(lesson => {
        lesson.classList.remove('active');
    });
    
    if (tutorialName === 'caesar') {
        document.getElementById('caesar-tutorial').classList.add('active');
    } else if (tutorialName === 'baconian') {
        document.getElementById('baconian-tutorial').classList.add('active');
    } else {
        // Show coming soon for other tutorials
        document.getElementById('coming-soon').classList.add('active');
    }
};

CodeBreakerApp.prototype.checkTutorialPractice = function() {
    const input = document.getElementById('practice-input');
    const result = document.getElementById('practice-result');
    const hint = document.querySelector('.practice-hint');
    
    if (!input || !result) return;

    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = 'coins'; // HTSQI with shift 5 backward = COINS
    
    result.classList.remove('correct', 'incorrect');
    
    if (userAnswer === correctAnswer) {
        result.textContent = '🎉 Correct! HTSQI decodes to COINS with a shift of 5.';
        result.classList.add('correct');
        if (hint) hint.style.display = 'none';
    } else {
        result.textContent = '❌ Not quite right. Try again!';
        result.classList.add('incorrect');
        if (hint) hint.style.display = 'block';
    }
};

CodeBreakerApp.prototype.checkBaconianTutorialPractice = function() {
    const input = document.getElementById('baconian-practice-input');
    const result = document.getElementById('baconian-practice-result');
    const hint = document.querySelector('.baconian-hint');
    
    if (!input || !result) return;

    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = 'hello'; // 00111 00010 01011 01011 01110 = AABBB AAAAB ABABB ABABB ABBBA = H E L L O
    
    result.classList.remove('correct', 'incorrect');
    
    if (userAnswer === correctAnswer) {
        result.textContent = '🎉 Correct! The message decodes to HELLO';
        result.classList.add('correct');
        if (hint) hint.style.display = 'none';
    } else {
        result.textContent = '❌ Not quite right. Try again!';
        result.classList.add('incorrect');
        if (hint) hint.style.display = 'block';
    }
};

CodeBreakerApp.prototype.checkVigenereTutorialPractice = function() {
    const input = document.getElementById('vigenere-practice-input');
    const result = document.getElementById('vigenere-practice-result');
    const hint = document.querySelector('.vigenere-hint');
    
    if (!input || !result) return;

    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = 'hsri'; // TSKP with keyword MATH decodes to HSRI
    
    result.classList.remove('correct', 'incorrect');
    
    if (userAnswer === correctAnswer) {
        result.textContent = '🎉 Correct! The message decodes to HSRI';
        result.classList.add('correct');
        if (hint) hint.style.display = 'none';
    } else {
        result.textContent = '❌ Not quite right. Try again!';
        result.classList.add('incorrect');
        if (hint) hint.style.display = 'block';
    }
};

CodeBreakerApp.prototype.checkBinaryTutorialPractice = function() {
    const input = document.getElementById('binary-practice-input');
    const result = document.getElementById('binary-practice-result');
    const hint = document.getElementById('binary-hint');
    
    if (!input || !result) return;

    const userAnswer = input.value.trim().toUpperCase();
    const correctAnswer = 'CODE BREAKER';
    
    result.classList.remove('correct', 'incorrect');
    
    if (userAnswer === correctAnswer) {
        result.textContent = '🎉 Excellent! The binary code decodes to "CODE BREAKER"!';
        result.classList.add('correct');
        if (hint) hint.style.display = 'none';
    } else {
        result.textContent = '❌ Not quite right. Try breaking the binary into 8-bit groups first!';
        result.classList.add('incorrect');
        if (hint) hint.style.display = 'block';
    }
};

// Bookmark functionality for engineering articles
function bookmarkArticle(articleId) {
    const btn = event.target.closest('.bookmark-btn');
    const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '[]');
    
    if (bookmarks.includes(articleId)) {
        // Remove bookmark
        const index = bookmarks.indexOf(articleId);
        bookmarks.splice(index, 1);
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-bookmark"></i>';
    } else {
        // Add bookmark
        bookmarks.push(articleId);
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-bookmark"></i>';
    }
    
    localStorage.setItem('articleBookmarks', JSON.stringify(bookmarks));
}

// Load bookmarks on page load
document.addEventListener('DOMContentLoaded', function() {
    const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '[]');
    bookmarks.forEach(articleId => {
        const btn = document.querySelector(`[onclick*="${articleId}"]`);
        if (btn) {
            btn.classList.add('active');
        }
    });
});

// Global functions for HTML onclick handlers
function switchTab(tabName) {
    if (window.debugApp) {
        window.debugApp.switchTab(tabName);
    }
}

function selectCipher(cipherType) {
    if (window.debugApp) {
        window.debugApp.selectCipher(cipherType);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const app = new CodeBreakerApp();
    // Make app globally available for debugging and HTML handlers
    window.debugApp = app;
});

// Add some educational content and tips
const educationalTips = [
    "💡 Tip: Start with simple ciphers like Caesar before trying complex ones!",
    "🔍 Hint: Look for common letter patterns like 'THE', 'AND', 'FOR' in your decoded text.",
    "📚 Remember: Practice makes perfect! Try different difficulty levels.",
    "🎯 Strategy: For keyword ciphers, try to identify the keyword first.",
    "⚡ Quick fact: The Caesar cipher is named after Julius Caesar who used it in ancient Rome!",
    "🔐 Fun fact: The Atbash cipher is one of the oldest known substitution ciphers."
];

// Display random tip in console for developers/teachers
console.log(educationalTips[Math.floor(Math.random() * educationalTips.length)]); 