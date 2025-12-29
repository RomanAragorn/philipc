'use client'

import React, { useState, useActionState } from "react";
import { UserSession, User} from '@/app/data/types';
import Navigation from '@/app/components/Navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowDown, CircleUser, Upload } from 'lucide-react';
import Button from '@/app/components/Button';
import Footer from '@/app/components/Footer';

// etong function na to laman yung galing sa lib/queries, which is yung gumagawa ng sql update mismo 
import { update, UpdateUserState } from './actions';

// fetch natin yung user information then display sa page, then lagay tayo ng parang button na maglalabas ng input thingy para maedit na yung page ganun

const CreateSettingsPage: React.FC = () => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [id, setId] = useState<number | null>();
    const initialState: UpdateUserState = {success: false};
    const [state, formAction, isPending] = useActionState<UpdateUserState, FormData>(update, initialState);
    const router = useRouter();

    // fetching session 
    React.useEffect(() => {
          const fetchUser = async (): Promise<void> => {
              try {
                  const response = await fetch('/api/session');
                  if (response.ok) {
                      const data = await response.json();
                      setUser(data.user || null);
                      setId(data.user.user_id || null)
                      
                  }
              } catch (err) {
                  console.error('Failed to fetch user:', err);
              }
          };
          fetchUser();
      }, []);

    // using id from session to fetch all user information to display on the page.
    React.useEffect(() => {
      if (!user?.username) return;

      const fetchUserInfo = async (): Promise<void> => {
        try {
          const response = await fetch(`/api/users/${user?.username}`);
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data.data.user || null);
          }
        } catch (err) {
          console.error('Failed to fetch user info', err);
        }
      };
      
      fetchUserInfo();
    }, [user?.username, state?.success]);

    React.useEffect(() => {
      if (state?.success) {
        router.refresh();
      }
    }, [state])
    
      
  return (
    <>
    <Navigation />
      <div className="flex min-h-screen w-full dark:bg-gray-8000">
          <div className="bg-[#DEDEDE] w-2/5 pt-10 p-10">
            <div className="flex items-center">
              <Link
                    className="hover:cursor-pointer"
                    href={'/'}
                >
                    <ArrowLeft />
                </Link>
              <h1 className="font-bold text-gray-900 text-3xl ml-10">Settings</h1>
            </div>
            <div>
              <h2 className="text-gray-900 text-2xl mt-15 mb-5"> 
                Edit Profile
              </h2>
              <h2 className="text-gray-900 text-2xl mt-15 mb-5"> 
                Change Password
              </h2>
            </div>
          </div>

          {/**Account Details container */}
          <div className="w-full mx-25 pt-10">
            <form action={formAction}>
            <h1 className="font-bold text-gray-900 text-3xl"> Edit Profile</h1>
            
            <h2 className="font-bold text-gray-900 text-2xl mt-15 mb-5"> Profile Picture</h2>
            <div className="flex items-center">
              <div>
                { /** insert conditional here para pag may pfp yun yung ididsplay imbes na yung circleuser */}
                <CircleUser className="h-25 w-25"/>
              </div>
              <div className="flex ml-20 border border-gray-900 rounded-3xl p-3">
                <Upload />
                <p className="ml-4">Upload Picture</p>
              </div>
            </div>

            {/** Lagyan ng name attribute lahat ng inputs here */}

            <h2 className="font-bold text-gray-900 text-2xl mt-15 mb-5">Account Details</h2>
            <div className="grid grid-cols-6 grid-rows-3 gap-4">
              <div className="col-span-6">
                <p>Username</p>
                <input name="username" defaultValue={userInfo?.username ?? undefined} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input>
              </div>
              <div className="col-span-3 row-start-2">
                  <p>First Name</p>
                  <input name="first_name" defaultValue={userInfo?.first_name ?? undefined} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input>
              </div>
              <div className="col-span-3 row-start-2">
                  <p>Last Name</p>
                  <input name="last_name" defaultValue={userInfo?.last_name ?? undefined} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input> 
              </div> 
              <div className="col-span-6 row-start-3">
                  <p>Facebook Link</p>
                <input name="fb_link" defaultValue={userInfo?.fb_link ?? "N/A"} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input>
                </div>
            </div>

            {/** Private details, need ng parang 2nd prompt before ka makapagedit ng informaiton mo.  */}
            <h2 className="font-bold text-gray-900 text-2xl mt-15 mb-5">Private Details</h2>
            <div className="grid grid-cols-6 grid-rows-3 gap-4">
              <div className="col-span-6">
                <p>Email</p>
                <div className="flex">
                  <input name="email" defaultValue={userInfo?.email ?? undefined} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input>
                  <div className="ml-10 flex items-center content-center">
                    Change
                  </div>
                </div>
              </div>
              
              <div className="col-span-6 row-start-2">
                <p>Phone Number</p>
                <div className="flex">
                  <input name="contact_no" defaultValue={userInfo?.contact_no ?? undefined} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input>
                  <div className="ml-10 flex items-center content-center">
                    Change
                  </div>
                </div>
              </div>
              <div className="col-span-6 row-start-3">
                <p>Password</p>
                <div className="flex">
                  <input name="password" defaultValue={userInfo?.password ?? undefined} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"></input>
                  <div className="ml-10 flex items-center content-center">
                    Change
                  </div>
                </div>
              </div>
            </div>


          {/**Save button */}
            <div className="grid grid-cols-6 grid-rows-1 gap-4 my-20">
              <div className="col-span-1 col-start-6 flex justify-end">
                  <input type="hidden" name="id" value={id ?? ""}></input>
                    <div className="flex">
                      <button type="submit"
                              disabled={isPending}
                              className="bg-dark-primary focus:ring-dark-primary w-full rounded-lg px-8 py-2.5 text-sm font-semibold text-nowrap text-white hover:cursor-pointer hover:bg-[#0C587B] focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        { isPending ? "Saving..." : "Save changes" }
                      </button>
                    </div>    
              </div>
            </div>
          </form>
          </div>
        </div>
        <Footer />
    </>
    
  );
}

export default CreateSettingsPage;