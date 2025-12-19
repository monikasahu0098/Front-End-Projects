const searchBtn = document.getElementById('searchBtn');
const wordInput = document.getElementById('wordInput');
const result = document.getElementById('result');

searchBtn.addEventListener('click', searchWord);
wordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchWord();
});

function searchWord() {
    const word = wordInput.value.trim();
    if (!word) {
        alert("Please enter a word");
        return;
    }

    result.innerHTML = "<p>Loading...</p>";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            if (data.title) {
                result.innerHTML = `<p>Word not found. Try another word.</p>`;
                return;
            }

            const wordData = data[0];
            let html = `<div class="word-card">`;

            // Word with pronunciation in brackets
            const pronunciation = wordData.phonetics.find(p => p.text)?.text || 
                                 wordData.phonetics[0]?.text || '';
            if (pronunciation) {
                html += `<h2>${wordData.word} (${pronunciation})</h2>`;
            } else {
                html += `<h2>${wordData.word}</h2>`;
            }

            // Collect data for the specific word
            const nounData = wordData.meanings.find(m => m.partOfSpeech.toLowerCase() === "noun");
            const verbData = wordData.meanings.find(m => m.partOfSpeech.toLowerCase() === "verb");
            const adjData = wordData.meanings.find(m => m.partOfSpeech.toLowerCase() === "adjective");

            // 1. Noun
            if (nounData) {
                const nounDef = nounData.definitions[0]?.definition || '';
                html += `<p><strong>Noun:</strong> ${nounDef}</p>`;
            }

            // 2. Verb (in short - first definition only)
            if (verbData) {
                const verbDef = verbData.definitions[0]?.definition || '';
                html += `<p><strong>Verb:</strong> ${verbDef}</p>`;
            }

            // 3. Adjective (in short - first definition only)
            if (adjData) {
                const adjDef = adjData.definitions[0]?.definition || '';
                html += `<p><strong>Adjective:</strong> ${adjDef}</p>`;
            }

            // 4. Synonyms for the entered word (combined from all meanings)
            let allSynonyms = [];
            wordData.meanings.forEach(meaning => {
                if (meaning.synonyms && meaning.synonyms.length > 0) {
                    allSynonyms = allSynonyms.concat(meaning.synonyms);
                }
                // Also check definitions for synonyms
                meaning.definitions?.forEach(def => {
                    if (def.synonyms && def.synonyms.length > 0) {
                        allSynonyms = allSynonyms.concat(def.synonyms);
                    }
                });
            });

            // Remove duplicates and take first 5 for "short"
            const uniqueSynonyms = [...new Set(allSynonyms)].slice(0, 5);
            if (uniqueSynonyms.length > 0) {
                html += `<p><strong>Synonyms:</strong> ${uniqueSynonyms.join(', ')}</p>`;
            }

            // 5. Antonyms for the entered word (combined from all meanings)
            let allAntonyms = [];
            wordData.meanings.forEach(meaning => {
                if (meaning.antonyms && meaning.antonyms.length > 0) {
                    allAntonyms = allAntonyms.concat(meaning.antonyms);
                }
                // Also check definitions for antonyms
                meaning.definitions?.forEach(def => {
                    if (def.antonyms && def.antonyms.length > 0) {
                        allAntonyms = allAntonyms.concat(def.antonyms);
                    }
                });
            });

            // Remove duplicates and take first 5 for "short"
            const uniqueAntonyms = [...new Set(allAntonyms)].slice(0, 5);
            if (uniqueAntonyms.length > 0) {
                html += `<p><strong>Antonyms:</strong> ${uniqueAntonyms.join(', ')}</p>`;
            }

            // 6. Example for the entered word (first available example)
            let example = '';
            
            // Try to find example from any meaning's first definition
            for (const meaning of wordData.meanings) {
                if (meaning.definitions[0]?.example) {
                    example = meaning.definitions[0].example;
                    break;
                }
            }
            
            if (!example) {
                // If no example in first definition, search through all definitions
                for (const meaning of wordData.meanings) {
                    for (const def of meaning.definitions) {
                        if (def.example) {
                            example = def.example;
                            break;
                        }
                    }
                    if (example) break;
                }
            }

            if (example) {
                html += `<p><strong>Example:</strong> ${example}</p>`;
            }

            // Voice pronunciation (use first available audio)
            const audioPhonetic = wordData.phonetics.find(p => p.audio);
            if (audioPhonetic?.audio) {
                html += `<p><strong>Pronunciation:</strong></p>`;
                html += `<audio controls src="${audioPhonetic.audio}"></audio>`;
            }

            html += `</div>`;
            result.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            result.innerHTML = "<p>Something went wrong. Try again later.</p>";
        });
}