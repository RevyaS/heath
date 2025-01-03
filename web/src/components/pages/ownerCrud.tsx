"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

export default function OwnerCrud({ guid }: { guid: string }) {
    const [loggedInState, setLoggedInState] = useState(false);
    const [invalidLoginState, setInvalidLoginState] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const [addOwnerNameInput, setAddOwnerNameInput] = useState("");
    const [addOwnerPasswordInput, setAddOwnerPasswordInput] = useState("");

    interface Owner {
        id: number | null | undefined;
        name: string;
        managementGuid: string;
    }

    const [ownerList, setOwnerList] = useState<Owner[]>([]);

    useEffect(() => {
        if (loggedInState) {
            fetchOwners();
        }
    }, [loggedInState])

    const confirmAdminLogin = async () => {
        const confirmAdminUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/confirmAdminLogin";

        const formData = new FormData();
        formData.append("guid", guid);
        formData.append("username", adminUsername);
        formData.append("password", adminPassword);

        const res = await fetch(confirmAdminUrl, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            setLoggedInState(true);
        } else {
            setInvalidLoginState(true);
        }
    }

    const fetchOwners = async () => {
        const getOwnersUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/ownersList";
        fetch(getOwnersUrl, {
            method: "POST",
        })
            .then(res => res.json())
            .then(data => {
                setOwnerList(data)
            })
    }

    const addOwner = async () => {
        const fetchUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/addOwner";

        const formData = new FormData();
        formData.append("username", addOwnerNameInput);
        formData.append("password", addOwnerPasswordInput);

        const res = await fetch(fetchUrl, {
            method: "POST",
            body: formData
        })

        if (res.ok) {
            fetchOwners();
        }
    }

    const onAdminUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminUsername(e.target.value);
    }

    const onAdminPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminPassword(e.target.value);
    }

    const onAddOwnerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddOwnerNameInput(e.target.value);
    }

    const onAddOwnerPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddOwnerPasswordInput(e.target.value);
    }

    return (
        <div>
            {!loggedInState && (
                <div className="space-y-2 px-5 place-content-center h-screen w-screen">
                    <Input value={adminUsername} onChange={onAdminUserNameChange} placeholder="Username" />
                    <Input value={adminPassword} onChange={onAdminPasswordChange} placeholder="Password" type="password" />
                    <Button onClick={confirmAdminLogin} className="w-full">Login</Button>
                    {invalidLoginState && (
                        <p className="text-red-500">Invalid login credentials</p>
                    )}
                </div>
            )}
            {loggedInState && (
                <div className="flex flex-col h-screen">
                    <h1 className="h-35">Owners</h1>

                    <div className="flex flex-row">
                        <Input value={addOwnerNameInput} onChange={onAddOwnerNameChange} placeholder="Username" />
                        <Input value={addOwnerPasswordInput} onChange={onAddOwnerPasswordChange} placeholder="Password" type="password" />
                        <Button onClick={addOwner}>Add</Button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Guid</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ownerList?.length > 0 ? (
                                ownerList?.map((owner) => (
                                    <tr key={owner.id}>
                                        <td>{owner.name}</td>
                                        <td>{owner.managementGuid}</td>
                                        <td>
                                            <Button>Edit</Button>
                                            <Button>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        No Owners Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}