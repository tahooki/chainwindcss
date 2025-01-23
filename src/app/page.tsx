import { DrawingCanvas } from "@/components/draw/drawing-canvas";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DrawingCanvas />
      </div>
    </main>
  );
}
