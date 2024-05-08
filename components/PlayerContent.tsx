"use client";
import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
// import useSound from "use-sound";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import ProgressSlider from "./ProgressSlider";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [audio] = useState(new Audio(songUrl));
  // const [play, { pause, sound }] = useSound(songUrl, {
  //   volume: volume,
  //   onplay: () => setIsPlaying(true),
  //   onend: () => {
  //     setIsPlaying(false);
  //     onPlayNext();
  //   },
  //   onpause: () => setIsPlaying(false),
  //   format: ["mp3"],
  // });

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formattedHours = hours > 0 ? `${hours}:` : "";
    const formattedMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
    const formattedSeconds = `${seconds < 10 ? "0" : ""}${seconds}`;

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(previousSong);
  };
  useEffect(() => {
    
    const handleLoadedMetadata = () => {
      setDuration(Math.floor(audio.duration));
    };

    const handleTimeUpdate = () => {
      const currentSeconds = Math.floor(audio.currentTime);
      setCurrentTime(currentSeconds);

      const progressPercentage = (currentSeconds / duration) * 100;
      setProgress(progressPercentage);
    };
    const onPlayNext = () => {
      if (player.ids.length === 0) {
        return;
      }
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      const nextSong = player.ids[currentIndex + 1];
  
      if (!nextSong) {
        return player.setId(player.ids[0]);
      }
      player.setId(nextSong);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onPlayNext();
    };
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
    };
  }, [songUrl, duration, audio, player]);

  // Ends here song duration

  useEffect(() => {
    audio?.play();
    setIsPlaying(true);

    return () => {
      audio?.pause();
    };
  }, [audio]);

  const handlePlay = () => {
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };
  const handleSeek = (value: number) =>{
    const newPosition = (value * audio.duration) / 100;
    audio.currentTime = newPosition;
  }

  return (
    <>
      <div className="flex items-center w-full">
        <div className="items-center px-3 text-xs">
          {formatTime(currentTime)}
        </div>

        <ProgressSlider
          value={progress}
          onChange={handleSeek}
        />

        <div className="items-center px-3 text-xs	">{formatTime(duration)}</div>
      </div>
      <div className="grid grid-cols md:grid-cols-3 h-full">
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} />
            <LikeButton songId={song.id} />
          </div>
          <div className="flex md:hidden col-auto w-full justify-end items-center">
            <div className="md:flex justify-end pr-2">
              <div className="">
                <VolumeIcon
                  onClick={toggleMute}
                  className="cursor-pointer"
                  size={34}
                />
                <div className="hidden">
                <Slider value={volume} onChange={(value) => setVolume(value)} />

                </div>
              </div>
            </div>

            <div
              onClick={handlePlay}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
            >
              <Icon size={30} className="text-black" />
            </div>

            
          </div>
        </div>

        <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon
              onClick={toggleMute}
              className="cursor-pointer"
              size={34}
            />
            
            <Slider value={volume} onChange={(value) => setVolume(value)} />

            
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerContent;
