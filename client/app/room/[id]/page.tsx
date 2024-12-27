import { Metadata } from "next"
import Room from "./room"
import { redirect } from "next/navigation"

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = (await params).id
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/room/${id}`).then((data) => {
        if(!data.ok) {
            redirect(`/error`) 
        }
        return data.json()
    });

    return {
        title: data.name,
        description: data.detail || "",
    }
}

export default async function Page ({ params }: Props) {
    const id = (await params).id
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/room/${id}`).then((data) => {
        if(!data.ok) {
            redirect(`/error`) 
        }
        return data.json()
    });

    return (
        <> 
            <Room room={data}/>
        </>
    );
}