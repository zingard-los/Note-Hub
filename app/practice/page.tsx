"use client"
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");

  const handleCalculate = () => {
    try {
      // Safely catch invalid mathematical expressions (e.g., "5++5")
      setValue(String(eval(value)));
    } catch (error) {
      setValue("Error");
    }
  };

  const handleInput = (e) => {
    setValue(value + e.target.innerText);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200">
        <form className="p-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Screen Display */}
          <div className="mb-6">
            <input
              type="text"
              value={value}
              readOnly
              className="w-full bg-gray-50 text-right text-5xl tracking-wider p-4 rounded-2xl shadow-inner border border-gray-100 focus:outline-none text-gray-800 h-24"
              placeholder="0"
            />
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-3 text-xl">
            {/* Row 1: Actions */}
            <button type="button" onClick={() => setValue("")} className="col-span-2 bg-red-100 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-200 active:scale-95 transition-all">AC</button>
            <button type="button" onClick={() => setValue(value.slice(0, -1))} className="bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-300 active:scale-95 transition-all">DE</button>
            <button type="button" onClick={handleInput} className="bg-blue-100 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-200 active:scale-95 transition-all">/</button>

            {/* Row 2 */}
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">7</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">8</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">9</button>
            <button type="button" onClick={handleInput} className="bg-blue-100 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-200 active:scale-95 transition-all">*</button>

            {/* Row 3 */}
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">4</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">5</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">6</button>
            <button type="button" onClick={handleInput} className="bg-blue-100 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-200 active:scale-95 transition-all">-</button>

            {/* Row 4 */}
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">1</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">2</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">3</button>
            <button type="button" onClick={handleInput} className="bg-blue-100 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-200 active:scale-95 transition-all">+</button>

            {/* Row 5 */}
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">00</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">0</button>
            <button type="button" onClick={handleInput} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-2xl active:scale-95 transition-all shadow-sm border border-gray-100">.</button>
            <button type="button" onClick={handleCalculate} className="bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-md">=</button>
          </div>
        </form>
      </div>
    </div>
  );
}