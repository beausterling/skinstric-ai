"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import NavButton from "@/components/NavButton";
import Rhombuses from "@/components/Rhombuses";
import Loading from "@/components/Loading";
import { analyzeImage } from "@/lib/api";
import { fileToDataUrl, stripPrefix } from "@/lib/image";
import { saveDemographics } from "@/lib/storage";

const optionSizes = [{ size: 482, opacity: 0.3 }, { size: 444, opacity: 0.6 }, { size: 405 }];

export default function Result() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".option", {
        scale: 0.92,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { scope: container },
  );

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const data = await analyzeImage(stripPrefix(dataUrl));
      saveDemographics(data);
      router.push("/select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <main
      ref={container}
      className="relative min-h-screen overflow-hidden lg:h-screen lg:min-h-[640px]"
    >
      <Header />
      <p className="label-bold absolute top-[86px] left-4 sm:left-8">To start analysis</p>

      <div className="flex min-h-screen flex-col items-center justify-center gap-0 pt-28 pb-24 lg:block lg:min-h-0 lg:p-0">
        {/* camera */}
        <div className="option relative flex h-[300px] w-[300px] items-center justify-center sm:h-[400px] sm:w-[400px] lg:absolute lg:top-[calc(50%+1px)] lg:left-1/4 lg:h-[482px] lg:w-[482px] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Rhombuses
            sizes={optionSizes}
            className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 scale-[0.62] sm:scale-[0.83] lg:scale-100"
          />
          <button
            onClick={() => setShowModal(true)}
            aria-label="Allow A.I. to scan your face"
            className="relative transition-transform duration-500 ease-out hover:scale-[1.12]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/camera-icon.svg"
              alt=""
              className="h-[90px] w-[90px] sm:h-[117px] sm:w-[117px]"
            />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/connector-camera.svg"
            alt=""
            className="absolute top-[calc(50%-98px)] left-[calc(50%+40px)] hidden sm:block"
          />
          <p className="label absolute top-[calc(50%+56px)] left-1/2 -translate-x-1/2 text-center text-[12px] leading-5 whitespace-nowrap sm:top-[calc(50%-115px)] sm:left-[calc(50%+112px)] sm:translate-x-0 sm:text-left sm:text-[14px] sm:leading-6">
            Allow A.I.
            <br />
            to scan your face
          </p>

          {showModal && (
            <div className="absolute top-[calc(50%+104px)] left-1/2 z-20 w-[min(352px,90vw)] -translate-x-1/2 bg-ink text-paper lg:top-[calc(50%-39px)] lg:left-[calc(50%+112px)] lg:translate-x-0">
              <p className="label-bold px-[15px] pt-[14px] pb-[62px] tracking-normal">
                Allow A.I. to access your camera
              </p>
              <div className="flex justify-end gap-[13px] border-t border-paper">
                <button
                  onClick={() => setShowModal(false)}
                  className="button-text px-4 py-[9.5px] opacity-70 hover:opacity-100"
                >
                  Deny
                </button>
                <button
                  onClick={() => router.push("/camera")}
                  className="button-text px-4 py-[9px]"
                >
                  Allow
                </button>
              </div>
            </div>
          )}
        </div>

        {/* gallery */}
        <div className="option relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:absolute lg:top-[calc(50%+1px)] lg:left-3/4 lg:h-[482px] lg:w-[482px] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Rhombuses
            sizes={optionSizes}
            className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 scale-[0.62] sm:scale-[0.83] lg:scale-100"
          />
          {/* the gallery option is greyed out while the camera popup is open */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              showModal ? "pointer-events-none opacity-25" : ""
            }`}
          >
            <button
              onClick={() => fileInput.current?.click()}
              aria-label="Allow A.I. access gallery"
              className="relative transition-transform duration-500 ease-out hover:scale-[1.12]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/gallery-icon.svg"
                alt=""
                className="h-[90px] w-[90px] sm:h-[117px] sm:w-[117px]"
              />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/connector-gallery.svg"
              alt=""
              className="absolute top-[calc(50%+40px)] right-[calc(50%+37px)] hidden sm:block"
            />
            <p className="label absolute top-[calc(50%+56px)] right-1/2 translate-x-1/2 text-center text-[12px] leading-5 whitespace-nowrap sm:top-[calc(50%+85px)] sm:right-[calc(50%+111px)] sm:translate-x-0 sm:text-right sm:text-[14px] sm:leading-6">
              Allow A.I.
              <br />
              access gallery
            </p>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <p className="label absolute bottom-24 left-1/2 w-full -translate-x-1/2 px-4 text-center text-red-700 normal-case">
          {error}
        </p>
      )}

      <div className="absolute bottom-9 left-4 sm:left-8">
        <NavButton label="Back" direction="left" href="/testing" />
      </div>

      {loading && <Loading text="Preparing your analysis ..." />}
    </main>
  );
}
