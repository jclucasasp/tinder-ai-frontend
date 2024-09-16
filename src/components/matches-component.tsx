import { ConversationInterface, MatchInterface, ProfileInterface } from "@/lib/interfaces";
import deleteMatchById, { GetMatchedProfiles } from "@/api/matches";
import { GetConversationFromTo } from "@/api/conversation";
import React, { useEffect, useState } from "react"
import SkeletonMatches from "@/components/skeleton-matches";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";

type MachesProps = {
    setCurrentProfile: React.Dispatch<React.SetStateAction<ProfileInterface | null>>;
    setCurrentConversation: React.Dispatch<React.SetStateAction<ConversationInterface | null>>;
    matchState: MatchState;
}

type MatchState = {
    setMatches: React.Dispatch<React.SetStateAction<MatchInterface[]>>;
    matches: MatchInterface[];
}

export default function Matches({ setCurrentProfile, setCurrentConversation, matchState }: MachesProps) {

    const userId = sessionStorage.getItem('userId');
    // const { matches, setMatches } = matchState;
    const [profiles, setProfiles] = useState<ProfileInterface[]>([]);
    const { toast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // TODO: This is causing a rerender and make unnecessary api calls for pictures
    const handleChat = async (profileId: string, toProfileId: string) => {
        const conversation = await GetConversationFromTo(profileId, toProfileId);
        setCurrentConversation(conversation);
        navigate('/chat');
    };

    // TODO: this is causing a double rerender
    const handleDelete = async (userId: string) => {

        toast({
            title: 'Deleting match',
            description: 'Are you sure you want to do that?',
            action: <ToastAction altText="Delete" onClick={async () => {
                const res = await deleteMatchById(userId);
                if (!res.ok) {
                    toast({
                        variant: 'destructive',
                        description: 'Something went wrong',
                    });
                } else {
                    setMatchedProfiles();
                }
            }}>Delete</ToastAction>
        });
    };

    const setMatchedProfiles = async () => {
        setLoading(true);
        const data = await GetMatchedProfiles(userId!);
        setProfiles(data);
        setLoading(false);
    };

    useEffect(() => {
        if (profiles.length == 0) {
            console.log("setMatchedProfiles called from useEffect")
            setMatchedProfiles();
        }
    }, []);

    // TODO: Find a way to iterate over both the profiles and the matches
    const MatchesList = () => {
        return (
            <Card className="p-2">
                <ul className="flex h-[80vh] flex-col gap-3 overflow-y-scroll p-2">
                    {loading && <SkeletonMatches />}
                    {
                        profiles.map((profile) => (
                            <li key={profile.userId} className="flex items-center justify-between">
                                <section className="flex gap-3 items-center">
                                    <Button variant={"link"} 
                                    onClick={() => { setCurrentProfile(profile); navigate('/profile') }} 
                                    className="mb-2 flex gap-4">
                                        <img src={"http://localhost:8080/images/" + profile.imageUrl} width={55} height={55} className="rounded-full" />
                                    <h3>{profile.firstName} {profile.lastName}</h3>
                                    </Button>
                                </section>
                                <section className="flex gap-6">
                                    <Button variant={"secondary"} size={'default'} className="gap-2"
                                        onClick={() => { handleChat(userId!, profile.userId); setCurrentProfile(profile) }}><XCircle />Chat</Button>
                                    <Button variant={"destructive"} size={'default'}
                                        onClick={() => { handleDelete(profile.userId) }}
                                        className="bg-red-500 gap-2">
                                        <XCircle />Del</Button>
                                </section>
                            </li>
                        ))
                    }
                </ul>
            </Card>
        );
    };

    return (
        <ul className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold border-b-2 border-gray-300">Current Matches</h2>
            <MatchesList />
        </ul>
    );
}