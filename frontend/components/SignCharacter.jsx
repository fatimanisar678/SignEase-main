import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

// ─── Inner 3D model (must be inside Canvas) ───────────────────────────────────
function CharacterModel({ modelSource, animationName, playing, speed = 1 }) {
    const group = useRef();
    const { scene, animations } = useGLTF(modelSource);
    const { actions, names } = useAnimations(animations, group);

    useEffect(() => {
        // Stop all running animations first
        Object.values(actions).forEach((action) => action.fadeOut(0.2).stop());

        if (playing && animationName) {
            const action = actions[animationName];
            if (action) {
                action.reset().fadeIn(0.3).setEffectiveTimeScale(speed).play();
            } else {
                // If exact name not found, try case-insensitive match
                const key = Object.keys(actions).find(
                    (k) => k.toLowerCase() === animationName.toLowerCase()
                );
                if (key) actions[key].reset().fadeIn(0.3).setEffectiveTimeScale(speed).play();
            }
        }
    }, [animationName, playing, actions, speed]);

    return (
        <primitive
            ref={group}
            object={scene}
            scale={1.6}
            position={[0, -1.8, 0]}
            rotation={[0, 0, 0]}
        />
    );
}

// ─── Loading placeholder inside Canvas ───────────────────────────────────────
function Loader() {
    return null; // Canvas shows nothing while loading — spinner shown outside
}

// ─── Main exported component ──────────────────────────────────────────────────
/**
 * SignCharacter
 *
 * Props:
 *   modelSource   — require('../assets/models/a.glb')  ← use require(), not a string
 *   animationName — string matching the animation name inside the GLB (e.g. 'hello')
 *   playing       — boolean, whether to play the animation
 *   speed         — number, animation playback speed (default 1)
 *   height        — number, canvas height in px (default 340)
 *   background    — string, background color (default '#BDE3E0')
 *   enableOrbit   — boolean, allow user to rotate the camera (default true)
 */
export default function SignCharacter({
    modelSource,
    animationName,
    playing = false,
    speed = 1,
    height = 340,
    background = '#BDE3E0',
    enableOrbit = true,
}) {
    const [loading, setLoading] = useState(true);

    if (!modelSource) {
        return (
            <View style={[styles.canvas, { height, backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>No character selected</Text>
            </View>
        );
    }

    return (
        <View style={[styles.wrapper, { height }]}>
            {loading && (
                <View style={[styles.loaderOverlay, { backgroundColor: background }]}>
                    <Text style={styles.loaderText}>Loading character…</Text>
                </View>
            )}

            <Canvas
                style={[styles.canvas, { backgroundColor: background }]}
                camera={{ position: [0, 0.5, 3.5], fov: 45 }}
                onCreated={() => setLoading(false)}
            >
                <ambientLight intensity={0.9} />
                <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
                <directionalLight position={[-3, 2, -2]} intensity={0.4} />

                <Suspense fallback={<Loader />}>
                    <CharacterModel
                        modelSource={modelSource}
                        animationName={animationName}
                        playing={playing}
                        speed={speed}
                    />
                </Suspense>

                {enableOrbit && (
                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.8}
                    />
                )}
            </Canvas>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    canvas: {
        flex: 1,
        width: '100%',
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: 24,
    },
    loaderText: {
        color: '#2A6E66',
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: '#666',
        fontSize: 14,
    },
});
