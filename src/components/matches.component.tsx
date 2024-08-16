import React, { useEffect, useState } from "react"
import deleteMatchById, { GetMatchesProfile } from "../api/matches";
import { ProfileInterface } from "../lib/interfaces";
import { XCircle } from "lucide-react";
import { GetConversationFromTo } from "../api/conversation";

type SetScreenProps = React.Dispatch<React.SetStateAction<StateTypes>>;
type ViewProfileProps = React.Dispatch<React.SetStateAction<ProfileInterface | null>>;
type StateTypes = 'profile' | 'match' | 'chat';


export default function Matches({ screen, viewProfile }: { screen: SetScreenProps, viewProfile: ViewProfileProps }) {

    const matchProfiles = async () => {
        return await GetMatchesProfile();
    }

    const viewConversations = async (fromProfileId: string, toProfileId: string) => {
        //  return await GetConversation(fromProfileId, toProfileId);
        return GetConversationFromTo(fromProfileId, toProfileId);
    }

    const handleDelete = async (id: string) => {
        const res = await deleteMatchById(id);
        if (res.ok) {
            window.alert('Match deleted successfully');
        } else {
            window.alert('Unable to delete match');
        }
    }

    const [profiles, setProfiles] = useState<ProfileInterface[]>([]);

    const handleChat = async (fromProfileId: string, toProfileId: string) => {
        const res = await viewConversations(fromProfileId, toProfileId);
        console.log(res);
        // screen('chat');
    }

    useEffect(() => {
        matchProfiles().then((data) => {
            setProfiles(data);
        })
    }, []);

    return (
        <ul className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold border-b-2 border-gray-300">Current Matches</h2>
            {profiles.map((profile) => (
                <li className="flex items-center justify-between" key={profile.id}>
                    <section className="flex gap-2 items-center">
                        <button onClick={() => { viewProfile(profile); screen('profile') }}>
                            <img src={"http://localhost:8080/images/" + profile.imageUrl} width={50} height={50} className="rounded-full" />
                        </button>
                        <h3>{profile.firstName} {profile.lastName}</h3>
                    </section>
                    <section className="flex gap-6">
                        <button className="rounded-lg bg-green-500 text-white p-2 h-11 hover:shadow-lg flex gap-2 items-center"
                            onClick={() => handleChat("8133d336-d2ca-4e06-94a8-d59c90d959ed", "d58f1c20-c802-4939-abfa-ca3e91d5d8e7")}><XCircle />Chat</button>
                        <button className="rounded-lg bg-red-500 text-white p-2 h-11 hover:shadow-lg flex gap-2 items-center"
                            onClick={() => { handleDelete(profile.id) }}><XCircle />Del</button>
                    </section>
                </li>
            ))}
        </ul>
    );
}