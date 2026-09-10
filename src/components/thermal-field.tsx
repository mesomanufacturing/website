"use client";

import { useEffect, useRef } from "react";
import { vertexShader, fragmentShader } from "@/lib/thermal-shader";
import styles from "@/app/launch.module.css";

export default function ThermalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    let dispose = () => {};
    function initialize() {
      if (!gl || !canvas) return;
      const shaders: WebGLShader[] = [];
      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
      };
      const vertex = compile(gl.VERTEX_SHADER, vertexShader);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) {
        shaders.forEach((shader) => gl.deleteShader(shader));
        if (program) gl.deleteProgram(program);
        return;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        shaders.forEach((shader) => gl.deleteShader(shader));
        gl.deleteProgram(program);
        return;
      }
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      gl.useProgram(program);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const sizeUniform = gl.getUniformLocation(program, "resolution");
      const timeUniform = gl.getUniformLocation(program, "time");
      const pointerUniform = gl.getUniformLocation(program, "pointer");
      const influenceUniform = gl.getUniformLocation(program, "influence");
      const media = matchMedia("(prefers-reduced-motion: reduce)");
      let frame = 0,
        last = 0,
        time = 0,
        px = 0,
        py = 0,
        tx = 0,
        ty = 0,
        influence = 0,
        targetInfluence = 0;
      const draw = () => {
        gl.uniform2f(sizeUniform, canvas.width, canvas.height);
        gl.uniform1f(timeUniform, time);
        gl.uniform2f(pointerUniform, px, py);
        gl.uniform1f(influenceUniform, influence * (media.matches ? 0.4 : 1));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.dataset.ready = "true";
      };
      const resize = new ResizeObserver(() => {
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(
          devicePixelRatio || 1,
          1.5,
          1800 / Math.max(rect.width, rect.height),
        );
        canvas.width = Math.max(1, Math.round(rect.width * ratio));
        canvas.height = Math.max(1, Math.round(rect.height * ratio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        draw();
      });
      resize.observe(canvas);
      const tick = (now: number) => {
        frame = requestAnimationFrame(tick);
        if (now - last < 1000 / 30) return;
        const delta = Math.min((now - last) / 1000, 0.1);
        last = now;
        if (document.hidden) return;
        // Keep automatic motion gentle for visitors who request less movement.
        time += delta * (media.matches ? 0.35 : 1);
        const follow = 1 - Math.exp(-delta * 6);
        px += (tx - px) * follow;
        py += (ty - py) * follow;
        influence += (targetInfluence - influence) * (1 - Math.exp(-delta * 3));
        draw();
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const rect = canvas.getBoundingClientRect();
        tx = (event.clientX - rect.left - rect.width * 0.5) / rect.height;
        ty = (rect.height * 0.5 - (event.clientY - rect.top)) / rect.height;
        if (targetInfluence === 0 && influence < 0.01) {
          px = tx;
          py = ty;
        }
        targetInfluence = 1;
      };
      const leave = () => {
        targetInfluence = 0;
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("blur", leave);
      frame = requestAnimationFrame(tick);
      dispose = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("blur", leave);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        shaders.forEach((shader) => gl.deleteShader(shader));
      };
    }
    const lost = (event: Event) => {
      event.preventDefault();
      dispose();
      canvas.dataset.ready = "false";
    };
    const restored = () => initialize();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    initialize();
    return () => {
      dispose();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
