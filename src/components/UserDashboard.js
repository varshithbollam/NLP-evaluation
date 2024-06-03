// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const UserPage = () => {
//     const { taskId, userId } = useParams();
//     const [sentences, setSentences] = useState([]);
//     const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
//     const [sentenceIndexInput, setSentenceIndexInput] = useState('');
//     const [progress, setProgress] = useState(0);
//     const [completedSentences, setCompletedSentences] = useState([]);
//     const [answers, setAnswers] = useState({
//         seriousness: null,
//         mistranslation: null,
//         spelling: null,
//         contextual_error: null,
//         tone: null,
//         lexical_word_choice: null,
//         punctuation: null
//     });

//     const fetchSentences = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5001/api/tasks/${taskId}`);
//             setSentences(response.data);
//         } catch (error) {
//             console.error('Error fetching sentences:', error);
//         }
//     };

//     const fetchProgress = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5001/api/progress/${userId}/${taskId}`);
//             setCompletedSentences(response.data.completedSentences);
//             setProgress(response.data.taskProgress);
//         } catch (error) {
//             console.error('Error fetching progress:', error);
//         }
//     };

//     useEffect(() => {
//         fetchSentences();
//         fetchProgress();
//     }, [taskId]);

//     useEffect(() => {
//         if (sentences.length > 0) {
//             const currentSentence = sentences[currentSentenceIndex];
//             const initialAnswers = {
//                 seriousness: currentSentence.seriousness === "NULL" ? null : currentSentence.seriousness,
//                 mistranslation: currentSentence.mistranslation === "NULL" ? null : currentSentence.mistranslation,
//                 spelling: currentSentence.spelling === "NULL" ? null : currentSentence.spelling,
//                 contextual_error: currentSentence.contextual_error === "NULL" ? null : currentSentence.contextual_error,
//                 tone: currentSentence.tone === "NULL" ? null : currentSentence.tone,
//                 lexical_word_choice: currentSentence.lexical_word_choice === "NULL" ? null : currentSentence.lexical_word_choice,
//                 punctuation: currentSentence.punctuation === "NULL" ? null : currentSentence.punctuation
//             };
//             setAnswers(initialAnswers);
//         }
//     }, [currentSentenceIndex, sentences]);

//     const handleAnswerChange = (key, value) => {
//         setAnswers({ ...answers, [key]: value });
//     };

//     const handlePrevious = () => {
//         setCurrentSentenceIndex(prevIndex => Math.max(prevIndex - 1, 0));
//     };

//     const handleNext = () => {
//         setCurrentSentenceIndex(prevIndex => Math.min(prevIndex + 1, sentences.length - 1));
//     };

//     const handleSubmit = async () => {
//         try {
//             await axios.post('http://localhost:5001/api/updateAnswers', { userId, sentenceId: sentences[currentSentenceIndex]._id, answers });
//             setCompletedSentences(prev => [...new Set([...prev, sentences[currentSentenceIndex]._id])]);
//             alert('Answers submitted successfully');
//         } catch (error) {
//             console.error('Error submitting answers:', error);
//         }
//         fetchSentences();
//         setCurrentSentenceIndex(prevIndex => Math.min(prevIndex + 1, sentences.length - 1));
//     };

//     const handleGoToSentence = () => {
//         const index = parseInt(sentenceIndexInput, 10) - 1; // Convert to 0-based index
//         if (index >= 0 && index < sentences.length) {
//             setCurrentSentenceIndex(index);
//         } else {
//             alert('Sentence index out of range');
//         }
//     };

//     const saveProgress = async (completedSentences, progress) => {
//         console.log('Saving progress:', { userId, taskId, completedSentences, progress });
//         try {
//             await axios.post('http://localhost:5001/api/saveProgress', {
//                 userId,
//                 taskId,
//                 completedSentences,
//                 taskProgress: progress
//             });
//             console.log('Progress saved successfully');
//         } catch (error) {
//             console.error('Error saving progress:', error);
//         }
//     };

//     useEffect(() => {
//         if (sentences.length > 0) {
//             const progress = Math.round((completedSentences.length / sentences.length) * 100);
//             console.log('Calculated progress:', progress);
//             setProgress(progress);
//             saveProgress(completedSentences, progress);
//         }
//     }, [completedSentences, sentences.length]);

//     return (
//         <div>
//             {sentences.length > 0 && (
//                 <div>
//                     <h2>Sentence {currentSentenceIndex + 1} of {sentences.length}</h2>
//                     <p>English: {sentences[currentSentenceIndex].english}</p>
//                     <p>Hindi: {sentences[currentSentenceIndex].hindi}</p>
//                     <hr />
//                     <h3>Answer Questions:</h3>
//                     {Object.entries(answers).map(([key, value]) => (
//                         <div key={key}>
//                             <p>{key}</p>
//                             {(
//                                 <>
//                                     <label>
//                                         <input type="radio" name={key} value="low" checked={value === 'low'} onChange={() => handleAnswerChange(key, 'low')} />
//                                         Low
//                                     </label>
//                                     <label>
//                                         <input type="radio" name={key} value="medium" checked={value === 'medium'} onChange={() => handleAnswerChange(key, 'medium')} />
//                                         Medium
//                                     </label>
//                                     <label>
//                                         <input type="radio" name={key} value="high" checked={value === 'high'} onChange={() => handleAnswerChange(key, 'high')} />
//                                         High
//                                     </label>
//                                 </>
//                             )}
//                         </div>
//                     ))}
//                     <hr />
//                     <button onClick={handlePrevious} disabled={currentSentenceIndex === 0}>Previous</button>
//                     <button onClick={handleNext} disabled={currentSentenceIndex === sentences.length - 1}>Next</button>
//                     <button onClick={handleSubmit}>Submit</button>
//                     <hr />
//                     <input
//                         type="number"
//                         placeholder="Enter sentence number"
//                         value={sentenceIndexInput}
//                         onChange={(e) => setSentenceIndexInput(e.target.value)}
//                     />
//                     <button onClick={handleGoToSentence}>Go to Sentence</button>
//                     <hr />
//                     <p>Progress: {progress}%</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserPage = () => {
    const { taskId, userId } = useParams();
    const [sentences, setSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [sentenceIndexInput, setSentenceIndexInput] = useState('');
    const [progress, setProgress] = useState(0);
    const [completedSentences, setCompletedSentences] = useState([]);
    const [answers, setAnswers] = useState({
        seriousness: null,
        mistranslation: null,
        spelling: null,
        contextual_error: null,
        tone: null,
        lexical_word_choice: null,
        punctuation: null
    });

    const fetchSentences = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/tasks/${taskId}`);
            setSentences(response.data);
        } catch (error) {
            console.error('Error fetching sentences:', error);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/progress/${userId}/${taskId}`);
            setCompletedSentences(response.data.completedSentences);
            setProgress(response.data.taskProgress);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    useEffect(() => {
        fetchSentences();
        fetchProgress();
    }, [taskId]);

    useEffect(() => {
        if (sentences.length > 0) {
            const currentSentence = sentences[currentSentenceIndex];
            const initialAnswers = {
                seriousness: currentSentence.seriousness === "NULL" ? null : currentSentence.seriousness,
                mistranslation: currentSentence.mistranslation === "NULL" ? null : currentSentence.mistranslation,
                spelling: currentSentence.spelling === "NULL" ? null : currentSentence.spelling,
                contextual_error: currentSentence.contextual_error === "NULL" ? null : currentSentence.contextual_error,
                tone: currentSentence.tone === "NULL" ? null : currentSentence.tone,
                lexical_word_choice: currentSentence.lexical_word_choice === "NULL" ? null : currentSentence.lexical_word_choice,
                punctuation: currentSentence.punctuation === "NULL" ? null : currentSentence.punctuation
            };
            setAnswers(initialAnswers);
        }
    }, [currentSentenceIndex, sentences]);

    const handleAnswerChange = (key, value) => {
        setAnswers({ ...answers, [key]: value });
    };

    const handlePrevious = () => {
        setCurrentSentenceIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentSentenceIndex(prevIndex => Math.min(prevIndex + 1, sentences.length - 1));
    };

    const handleSubmit = async () => {
        try {
            const sentenceId = sentences[currentSentenceIndex]._id;
            await axios.post('http://localhost:5001/api/updateAnswers', { userId, sentenceId, answers });
    
            // Update the list of completed sentences
            setCompletedSentences(prev => [...new Set([...prev, sentenceId])]);
    
            // Construct the updated SentencePair object
            const updatedSentence = {
                ...sentences[currentSentenceIndex],
                errors: {
                    seriousness: answers.seriousness,
                    mistranslation: answers.mistranslation,
                    spelling: answers.spelling,
                    contextual_error: answers.contextual_error,
                    tone: answers.tone,
                    lexical_word_choice: answers.lexical_word_choice,
                    punctuation: answers.punctuation
                }
            };
    
            // Update the sentences array with the updated sentence
            setSentences(prev => {
                const updatedSentences = [...prev];
                updatedSentences[currentSentenceIndex] = updatedSentence;
                return updatedSentences;
            });
    
            alert('Answers submitted successfully');
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
        // Move to the next sentence
        setCurrentSentenceIndex(prevIndex => Math.min(prevIndex + 1, sentences.length - 1));
    };
    


    const handleGoToSentence = () => {
        const index = parseInt(sentenceIndexInput, 10) - 1; // Convert to 0-based index
        if (index >= 0 && index < sentences.length) {
            setCurrentSentenceIndex(index);
        } else {
            alert('Sentence index out of range');
        }
    };

    const saveProgress = async (completedSentences, progress) => {
        console.log('Saving progress:', { userId, taskId, completedSentences, progress });
        try {
            await axios.post('http://localhost:5001/api/saveProgress', {
                userId,
                taskId,
                completedSentences,
                taskProgress: progress
            });
            console.log('Progress saved successfully');
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    useEffect(() => {
        if (sentences.length > 0) {
            const progress = Math.round((completedSentences.length / sentences.length) * 100);
            console.log('Calculated progress:', progress);
            setProgress(progress);
            saveProgress(completedSentences, progress);
        }
    }, [completedSentences, sentences.length]);

    return (
        <div>
            {sentences.length > 0 && (
                <div>
                    <h2>Sentence {currentSentenceIndex + 1} of {sentences.length}</h2>
                    <p>English: {sentences[currentSentenceIndex].english}</p>
                    <p>Hindi: {sentences[currentSentenceIndex].hindi}</p>
                    <hr />
                    <h3>Answer Questions:</h3>
                    {Object.entries(answers).map(([key, value]) => (
                        <div key={key}>
                            <p>{key}</p>
                            {(
                                <>
                                    <label>
                                        <input type="radio" name={key} value="low" checked={value === 'low'} onChange={() => handleAnswerChange(key, 'low')} />
                                        Low
                                    </label>
                                    <label>
                                        <input type="radio" name={key} value="medium" checked={value === 'medium'} onChange={() => handleAnswerChange(key, 'medium')} />
                                        Medium
                                    </label>
                                    <label>
                                        <input type="radio" name={key} value="high" checked={value === 'high'} onChange={() => handleAnswerChange(key, 'high')} />
                                        High
                                    </label>
                                </>
                            )}
                        </div>
                    ))}
                    <hr />
                    <button onClick={handlePrevious} disabled={currentSentenceIndex === 0}>Previous</button>
                    <button onClick={handleNext} disabled={currentSentenceIndex === sentences.length - 1}>Next</button>
                    <button onClick={handleSubmit}>Submit</button>
                    <hr />
                    <input
                        type="number"
                        placeholder="Enter sentence number"
                        value={sentenceIndexInput}
                        onChange={(e) => setSentenceIndexInput(e.target.value)}
                    />
                    <button onClick={handleGoToSentence}>Go to Sentence</button>
                    <hr />
                    <p>Progress: {progress}%</p>
                    <p>Completed Sentences: {completedSentences.length}/{sentences.length} done</p>
                </div>
            )}
        </div>
    );
};
export default UserPage;
