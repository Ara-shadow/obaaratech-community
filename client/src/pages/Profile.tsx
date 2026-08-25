import {
    useEffect,
    useState
} from "react";

import {
    getProfile,
    updateProfile
} from "../api/profile";

import type {
    Profile as ProfileType
} from "../api/profile";


export default function Profile() {


    const [
        profile,
        setProfile
    ] = useState<ProfileType | null>(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        form,
        setForm
    ] = useState({

        name:"",
        phone:""

    });



    useEffect(() => {


        async function loadProfile(){

            try{

                const data =
                    await getProfile();


                setProfile(data);


                setForm({

                    name:data.name || "",

                    phone:data.phone || ""

                });


            }catch(error){

                console.error(
                    "Profile load error",
                    error
                );

            }
            finally{

                setLoading(false);

            }

        }


        loadProfile();


    },[]);



    async function handleSubmit(
        event:React.FormEvent
    ){

        event.preventDefault();


        try{

            setSaving(true);


            const updated =
                await updateProfile(form);


            setProfile(updated);


            alert(
                "Profile updated successfully"
            );


        }catch(error){

            console.error(
                error
            );


            alert(
                "Update failed"
            );


        }
        finally{

            setSaving(false);

        }

    }



    if(loading){

        return (

            <main className="account-page">

                <div className="account-container">

                    Loading profile...

                </div>

            </main>

        );

    }



    return (

        <main className="account-page">


            <div className="account-container">


                <section className="account-header">

                    <div className="account-profile">


                        <div className="account-avatar">

                            👤

                        </div>


                        <div>

                            <h1>
                                My Profile
                            </h1>

                            <p>
                                Manage your Obaaratech account information
                            </p>

                        </div>


                    </div>


                </section>



                <section className="account-info-card">


                    <form onSubmit={handleSubmit}>


                        <label>

                            Name

                            <input

                                value={form.name}

                                onChange={
                                    e =>
                                    setForm({

                                        ...form,

                                        name:e.target.value

                                    })
                                }

                            />

                        </label>



                        <label>

                            Email

                            <input

                                value={
                                    profile?.email || ""
                                }

                                disabled

                            />

                        </label>



                        <label>

                            Phone

                            <input

                                value={form.phone}

                                onChange={
                                    e =>
                                    setForm({

                                        ...form,

                                        phone:e.target.value

                                    })
                                }

                            />

                        </label>



                        <label>

                            Role

                            <input

                                value={
                                    profile?.role || ""
                                }

                                disabled

                            />

                        </label>



                        <button
                            type="submit"
                            disabled={saving}
                        >

                            {
                                saving
                                ?
                                "Saving..."
                                :
                                "Save Profile"
                            }


                        </button>


                    </form>


                </section>


            </div>


        </main>

    );

}