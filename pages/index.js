import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
    const [cameraPosition, setCameraPosition] = useState(0);
    const [obstacles, setObstacles] = useState([]);
    const [isJumping, setIsJumping] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const generateObstacles = () => {
        const newObstacles = [];
        const obstacleCount = 300;
        const spacing = 200;

        for (let i = 0; i < obstacleCount; i++) {
            const obstacle = {
                left: i * spacing + 700,
                bottom: 50
            };
            newObstacles.push(obstacle);
        }
        setObstacles(newObstacles);
    };

    const checkCollision = () => {
        const cube = document.getElementById('cube');
        const cubeRect = cube.getBoundingClientRect();

        for (let obstacle of obstacles) {
            const obstacleElement = document.getElementById(`obstacle-${obstacle.left}`);
            const obstacleRect = obstacleElement.getBoundingClientRect();

            if (
                cubeRect.left < obstacleRect.left + obstacleRect.width &&
                cubeRect.left + cubeRect.width > obstacleRect.left &&
                cubeRect.bottom < obstacleRect.bottom + obstacleRect.height &&
                cubeRect.bottom + cubeRect.height > obstacleRect.bottom
            ) {
                setGameOver(true);
                break;
            }
        }
    };

    useEffect(() => {
        const socket = io();

        const handleKeyDown = (event) => {
            if (gameOver) return;

            let newCameraPosition = cameraPosition;
            switch (event.code) {
                case 'Space':
                    setIsJumping(true);
                    socket.emit('jump');
                    break;
                case 'KeyA':
                    newCameraPosition -= 5; // Ajusta la velocidad de movimiento hacia la izquierda
                    break;
                case 'KeyD':
                    newCameraPosition += 5; // Ajusta la velocidad de movimiento hacia la derecha
                    break;
                default:
                    break;
            }
            setCameraPosition(newCameraPosition);
        };

        window.addEventListener('keydown', handleKeyDown);

        socket.on('jump', () => {
            const cube = document.getElementById('cube');
            cube.classList.add('jump');
            setTimeout(() => {
                cube.classList.remove('jump');
                setIsJumping(false);
            }, 500);
        });

        generateObstacles();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            socket.disconnect();
        };
    }, [cameraPosition, gameOver]);

    useEffect(() => {
        if (!gameOver) {
            const interval = setInterval(checkCollision, 100);
            return () => clearInterval(interval);
        }
    }, [cameraPosition, obstacles, gameOver]);

    const handleRestart = () => {
        setCameraPosition(0);
        setGameOver(false);
        setIsJumping(false);
        generateObstacles();
    };

    return (
        <div>
            <Head>
                <title>Inicio</title>
                <meta name="description" content="Página principal de mi juego web" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Sidebar />
            <div className="sky"></div> {/* Fondo azul */}
            {Array.from({ length: 50 }).map((_, index) => (
                <div
                    key={index}
                    className="star"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        top: `${Math.random() * 100}vh`
                    }}
                ></div>
            ))}
            <div className="game-container">
                <div id="cube" className="cube"></div>
                <div className="ground"></div>
                <main style={{ transform: `translateX(${-cameraPosition}px)` }}>
                    {obstacles.map((obstacle, index) => (
                        <div
                            key={index}
                            id={`obstacle-${obstacle.left}`}
                            className="obstacle"
                            style={{ left: `${obstacle.left}px`, bottom: `${obstacle.bottom}px` }}
                        ></div>
                    ))}
                </main>
                {gameOver && (
                    <div className="game-over">
                        <p>Fin del juego</p>
                        <button onClick={handleRestart}>Reiniciar</button>
                    </div>
                )}
            </div>
            <style jsx>{`
                .game-container {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                }
                .cube {
                    width: 50px;
                    height: 50px;
                    background-color: blue;
                    position: absolute;
                    left: 50%;
                    bottom: 50px;
                    transform: translateX(-50%);
                    transition: bottom 0.5s;
                }
                .cube.jump {
                    bottom: 150px;
                }
                .ground {
                    width: 100%;
                    height: 50px;
                    background-color: green;
                    position: absolute;
                    bottom: 0;
                }
                .obstacle {
                    width: 25px;
                    height: 25px;
                    background-color: red;
                    position: absolute;
                }
                main {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 2000px; /* Ajusta según el tamaño del mundo del juego */
                    height: 100%;
                }
                .game-over {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .game-over button {
                    margin-top: 10px;
                    padding: 10px 20px;
                    background-color: white;
                    color: black;
                    border: none;
                    cursor: pointer;
                }
                .sky {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #87ceeb; /* Azul claro */
                }
                .star {
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    background-color: white;
                }
            `}</style>
        </div>
    );
};

export default HomePage;