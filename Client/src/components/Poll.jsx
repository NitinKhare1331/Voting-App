import axios from "axios";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Poll() {

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [polls, setPolls] = useState([]);
    const [votedPolls, setVotedPolls] = useState([]); // Track which polls user has voted for

    useEffect(() => {
        // Fetch all polls on initial load
        const fetchPolls = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/polls");
                setPolls(response.data); // Set the polls state with data from the backend
            } catch (error) {
                console.error("Error fetching polls:", error);
            }
        };
        fetchPolls();

        // Listen for real-time updates
        socket.on("pollCreated", (newPoll) => {
            setPolls((prevPolls) => [...prevPolls, newPoll]);
        });

        socket.on("pollUpdated", (updatedPoll) => {
            setPolls((prevPolls) =>
                prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
            );
        });

        // Fetch voted polls from localStorage
        const storedVotedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
        setVotedPolls(storedVotedPolls);

        return () => {
            socket.off("pollCreated");
            socket.off("pollUpdated");
        };
    }, []);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/poll/create", {
                question,
                options,
            });
            setQuestion('');
            setOptions(['', '', '', '']);
        } catch (error) {
            console.error("Error creating poll:", error);
        }
    };

    const handleVote = async (pollId, optionIndex) => {
        // Check if the user has already voted for this poll
        if (votedPolls.includes(pollId)) {
            alert("You've already voted for this poll.");
            return;
        }

        try {
            // Submit the vote to the backend
            await axios.post(`http://localhost:3000/api/poll/${pollId}/vote`, {
                optionIndex,
            });

            // Mark this poll as voted and update state
            const updatedVotedPolls = [...votedPolls, pollId];
            setVotedPolls(updatedVotedPolls);

            // Save the updated voted polls to localStorage
            localStorage.setItem('votedPolls', JSON.stringify(updatedVotedPolls));

            // Emit event for real-time updates
            socket.emit('pollUpdated', { pollId, optionIndex });

        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleDeletePoll = async (pollId) => {
        try {
            await axios.delete(`http://localhost:3000/api/poll/${pollId}/delete`);
            setPolls(polls.filter((poll) => poll._id !== pollId));
            console.log('Poll deleted successfully');
        } catch (error) {
            console.error('Error deleting poll:', error);
        }
    };

    return (
        <>
            <div>
            <h1 className="content-center bg-green-700 text-3xl p-3 flex justify-center mb-10">Create a Custom Poll</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center mb-2">
                    <label>Question:</label>
                    <input
                        className="border-2 border-black ml-5"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                {options.map((option, index) => (
                    <div key={index} className="flex justify-center m-2">
                        <label>Option {index + 1}:</label>
                        <input
                            className="border-2 border-black ml-5"
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="border-2 border-black ml-[700px] mb-4">Create Poll</button>
            </form>

            <h2>Available Polls</h2>
            {polls.map((poll) => (
                <div key={poll._id}>
                    <h3>{poll.question}</h3>
                    {poll.options.map((option, index) => (
                        <div key={index}>
                            <button
                                onClick={() => handleVote(poll._id, index)}
                                disabled={votedPolls.includes(poll._id)} // Disable button if the user has already voted
                            >
                                Vote for: {option.text}
                            </button>
                            <p>{option.text} - {option.votes} votes</p>
                        </div>
                    ))}
                    <button onClick={() => handleDeletePoll(poll._id)}>Delete Poll</button>
                </div>
            ))}
        </div>
        </>
    )
}

export default Poll;