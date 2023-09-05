import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer"
import { useUser } from "./useUser";

import { Song } from "@/types";


const useOnPlay = (songs: Song[]) => {
    const players = usePlayer();
    const authModal = useAuthModal();
    const { user } =  useUser();

    const onPlay = (id: string)=>{
        if(!user){
            return authModal.onOpen();
        }

        players.setId(id);
        players.setIds(songs.map((song) => song.id))
    }
    return onPlay;
}

export default useOnPlay;