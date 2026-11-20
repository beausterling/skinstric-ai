"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import NavButton from "@/components/NavButton";
import Loading from "@/components/Loading";
import Tips from "@/components/Tips";
import { analyzeImage } from "@/lib/api";
import { stripPrefix, videoToDataUrl } from "@/lib/image";
import { saveDemographics } from "@/lib/storage";

type Status = "setup" | "live" | "captured" | "loading" | "error";

export default function Camera() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("setup");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream.current = media;
        if (video.current) {
          video.current.srcObject = media;
          await video.current.play();
        }
        setStatus("live");
      } catch {
        if (!cancelled) {
          setError("We could not access your camera. Please allow camera access and try again.");
          setStatus("error");
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function takePicture() {
    if (!video.current) return;
    setPhoto(videoToDataUrl(video.current));
    setStatus("captured");
  }

  function retake() {
    setPhoto("");
    setError("");
    setStatus("live");
  }

  async function proceed() {
    setStatus("loading");
    try {
      const data = await analyzeImage(stripPrefix(photo));
      saveDemographics(data);
      router.push("/select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("captured");
    }
  }

  const onPhoto = status === "live" || status === "captured";

  return (
    <main className="relative h-dvh min-h-[560px] overflow-hidden bg-[#cdcecc]">
      {/* the video stays mounted so the stream keeps running when retaking */}
      <video
        ref={video}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${
          status === "live" ? "" : "invisible"
        }`}
      />

      {status === "captured" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt="Your selfie"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {onPhoto && <Header light section={status === "captured" ? "Analysis" : "Intro"} />}

      {status === "live" && (
        <>
          <button
            onClick={takePicture}
            className="group absolute bottom-[176px] left-1/2 flex -translate-x-1/2 items-center gap-4 text-paper lg:top-1/2 lg:right-8 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2"
          >
            <span className="button-text hidden opacity-70 transition-opacity group-hover:opacity-100 lg:block">
              Take picture
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/take-picture.svg"
              alt="Take picture"
              className="h-[62px] w-[62px] transition-transform duration-300 group-hover:scale-110"
            />
          </button>
          <div className="absolute bottom-9 left-4 sm:left-8">
            <NavButton label="Back" direction="left" href="/result" light hideLabelOnMobile />
          </div>
        </>
      )}

      {status === "captured" && (
        <>
          <p className="label absolute top-[26.5%] left-1/2 -translate-x-1/2 text-paper">
            Great shot!
          </p>
          {error && (
            <p className="label absolute top-[32%] left-1/2 w-full -translate-x-1/2 px-4 text-center text-paper normal-case">
              {error}
            </p>
          )}
          <div className="absolute bottom-9 left-4 sm:left-8">
            <NavButton label="Back" direction="left" onClick={retake} light hideLabelOnMobile />
          </div>
          <div className="absolute right-4 bottom-9 sm:right-8">
            <NavButton
              label="Proceed"
              direction="right"
              onClick={proceed}
              light
              hideLabelOnMobile
            />
          </div>
        </>
      )}

      {onPhoto && (
        <div className="pointer-events-none absolute bottom-[42px] left-1/2 w-full -translate-x-1/2 px-16 sm:px-28">
          <Tips light done={status === "captured" ? 2 : 0} />
        </div>
      )}

      {status === "setup" && (
        <div className="absolute inset-0 bg-paper">
          <Loading
            text="Setting up camera ..."
            // eslint-disable-next-line @next/next/no-img-element
            icon={<img src="/icons/camera-icon.svg" alt="" className="h-[130px] w-[130px]" />}
          />
          <div className="absolute bottom-[170px] left-1/2 z-50 w-full -translate-x-1/2 px-4">
            <Tips />
          </div>
        </div>
      )}

      {status === "loading" && <Loading text="Preparing your analysis ..." />}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
          <p className="label-bold">Camera unavailable</p>
          <p className="label max-w-[420px] normal-case">{error}</p>
          <NavButton label="Back" direction="left" href="/result" />
        </div>
      )}
    </main>
  );
}
