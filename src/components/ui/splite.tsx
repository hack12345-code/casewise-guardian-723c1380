
'use client'

import { Suspense, lazy, useEffect, useRef } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const splineRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (splineRef.current) {
        // @ts-ignore - Spline types are not complete
        const splineApp = splineRef.current;
        if (splineApp.setVariable) {
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = -(e.clientY / window.innerHeight) * 2 + 1;
          splineApp.setVariable("mouseX", x);
          splineApp.setVariable("mouseY", y);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const onLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    console.log("Spline scene loaded", splineApp); // Debug log
  };

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={onLoad}
      />
    </Suspense>
  )
}
