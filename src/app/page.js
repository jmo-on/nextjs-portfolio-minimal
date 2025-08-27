"use client";

import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Moon component
function Moon({ shrink }) {
    const moonRef = useRef();
    const textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
    const displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

    const [colorMap, displacementMap] = useLoader(THREE.TextureLoader, [textureURL, displacementURL]);

    useFrame(() => {
        moonRef.current.rotation.y += 0.002;
        moonRef.current.rotation.x += 0.0001;
    });

    return (
        <mesh ref={moonRef} scale={shrink ? 0.5 : 2}>
            <sphereGeometry args={[2, 60, 60]} />
            <meshPhongMaterial
                map={colorMap}
                displacementMap={displacementMap}
                displacementScale={0.06}
                bumpMap={displacementMap}
                bumpScale={0.04}
            />
        </mesh>
    );
}

export default function Home() {
    const [shrink, setShrink] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [currentPage, setCurrentPage] = useState('HOME');

    useEffect(() => {
        const handleScroll = () => {
            console.log(window.scrollY.toString())
            if (window.scrollY > 100) {
                setShrink(true);
                setShowButtons(true)
            } else {
                setShrink(false);
                setShowButtons(false)
            }

            if (window.scrollY > 200) {
                console.log("show")
            } else {
                console.log("no show")
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <main className='flex flex-col items-center'>
            <header className={`mt-60 ${showButtons ? 'opacity-0' : 'opacity-100'} text-black text-lg font-sans antialiased`}>
                Jin Hong Moon
            </header>
            <div className='h-[150vh] w-full'>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <OrbitControls enablePan={false} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[-100, 10, 50]} intensity={1} />
                    <Moon shrink={shrink} />
                </Canvas>
            </div>
            <div className='h-[150vh] overflow-hidden'>
                <div className={`flex justify-center transition-all duration-500 ease-in-out ${shrink ? 'mt-[750px] w-32 h-32' : 'mt-[100px] w-[2000px] h-[2000px]'} bg-gray-500 border rounded-full`}>
                    <div className={`inset-0 flex flex-col items-center justify-center ${showButtons ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-1000`}>
                        <button
                            className={`absolute transform -translate-y-12 text-gray-600 ${currentPage === 'HOME' ? 'font-bold' : ''}`}
                            onClick={() => handleClick('HOME')}
                        >
                            HOME
                        </button>
                        <button
                            className={`absolute transform -translate-x-32 translate-y-12 text-gray-600 ${currentPage === 'ABOUT' ? 'font-bold' : ''}`}
                            onClick={() => handleClick('ABOUT')}
                        >
                            ABOUT
                        </button>
                        <button
                            className={`absolute transform translate-x-32 translate-y-12 text-gray-600 ${currentPage === 'STYLE' ? 'font-bold' : ''}`}
                            onClick={() => handleClick('STYLE')}
                        >
                            STYLE
                        </button>
                        <button
                            className={`absolute transform translate-y-40 text-gray-600 ${currentPage === 'IDEA' ? 'font-bold' : ''}`}
                            onClick={() => handleClick('IDEA')}
                        >
                            IDEA
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
