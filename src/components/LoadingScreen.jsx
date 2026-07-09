import React from "react";

const LoadingScreen = () => {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, #000000, #1b2333),
          repeating-linear-gradient(
            0deg,
            rgba(253,172,51,.08) 0px,
            rgba(253,172,51,.08) 1px,
            transparent 1px,
            transparent 90px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(236,223,204,.05) 0px,
            rgba(236,223,204,.05) 1px,
            transparent 1px,
            transparent 80px
          )
        `,
      }}
    >
      {/* Navbar */}
      <div className="mx-auto max-w-[95%] pt-10">
        <div className="h-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl animate-pulse flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-56 rounded-lg bg-white/10" />
          </div>

          
        </div>
      </div>

      {/* Center Card */}
      <div className="flex justify-center items-center pt-20">
        <div className="w-[430px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 animate-pulse">

          {/* Badge */}
          <div className="h-8 w-44 rounded-full bg-cyan-400/10 mb-8" />

          {/* Title */}
          <div className="h-10 w-64 rounded bg-white/10 mb-4" />

          <div className="h-4 w-80 rounded bg-white/5 mb-8" />

          {/* Input */}
          <div className="space-y-5">
            <div className="h-14 rounded-xl bg-white/10" />
            <div className="h-14 rounded-xl bg-white/10" />
            <div className="h-14 rounded-xl bg-white/10" />
          </div>

          {/* Button */}
          <div className="mt-8 h-14 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-12 flex flex-col items-center">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce" />
          <div
            className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: ".15s" }}
          />
          <div
            className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: ".3s" }}
          />
        </div>

        <p className="mt-5 text-slate-300 text-lg tracking-wide">
          Checking your session...
        </p>

        <p className="text-slate-500 text-sm mt-2">
          Preparing your collaborative workspace
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;