import { useState, useEffect } from 'react'
import './App.css'

const audioQ = new Audio('./src/assets/Heater-1.mp3');
const audioW = new Audio('./src/assets/Heater-2.mp3');
const audioE = new Audio('./src/assets/Heater-3.mp3');
const audioA = new Audio('./src/assets/Heater-4.mp3');
const audioS = new Audio('./src/assets/Clap.mp3');
const audioD = new Audio('./src/assets/OpenHH.mp3');
const audioZ = new Audio('./src/assets/Kick_n_Hat.mp3');
const audioX = new Audio('./src/assets/Kick.mp3');
const audioC = new Audio('./src/assets/ClosedHH.mp3');

const audioObjects: Record<string, HTMLAudioElement> = {
    Q: audioQ,
    W: audioW,
    E: audioE,
    A: audioA,
    S: audioS,
    D: audioD,
    Z: audioZ,
    X: audioX,
    C: audioC
};

interface KeyPadProps {
    value: string;
    onClick: () => void;
}

const KeyPad: React.FC<KeyPadProps> = ({ value, onClick }) => (
    <button className="drum-pad" id={value + "Pad"} onClick={onClick} >
        {value}
        <audio className="clip" id={value} src={audioObjects[value]?.src} >
        </audio>
    </button>
);




function App() {
    interface ClickParams {
        val: string
    }
    const [displayName, setDisplayName] = useState("PRESS A KEY!");
    const [grid, setGrid] = useState([
        ["Q", "W", "E"],
        ["A", "S", "D"],
        ["Z", "X", "C"]
    ]);

    const handleClick = ({ val }: ClickParams) => {
        //console.log(`${val}`);
        const clickedLetter = val;
        setDisplayName(clickedLetter);
        // Get the actual <audio> obj
        const audioObject = document.getElementById(clickedLetter) as HTMLAudioElement | null;

        if (audioObject) {
            audioObject?.addEventListener('loadedmetadata', () => {
                audioObject.play();
            });

            // Check if the metadata is already loaded (e.g., audio was cached)
            if (audioObject?.readyState >= audioObject?.HAVE_METADATA) {
                audioObject?.play();
            }
        }
        else {
            console.log("Audio not found");
        }
    }

    const GlobalInputListener = () => {
        const handleKeyDown = (event) => {
            const pressedKey = event.key.toUpperCase();
            //console.log(`${pressedKey}`);
            //console.log('Key pressed globally:', pressedKey);
            if (grid.some(row => row.includes(pressedKey))) {
                handleClick({ val: pressedKey });
            } else {
                console.log(`Can't find ${pressedKey}`);
            }
            

        };

        useEffect(() => {
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }, []);

        return null;
    };

    return (
        <div>
            <GlobalInputListener></GlobalInputListener>
            <div id="contents">
                <div id="drum-machine">
                    <div className="grid-row" >
                        <p id="display">{displayName}</p>
                    </div>
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid-row" id={`grid-row${rowIndex + 1}` } >
                            {row.map((val) => (
                                <KeyPad
                                    value={val}
                                    onClick={() => handleClick({ val })}
                                >
                                </KeyPad>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
  )
}

export default App
