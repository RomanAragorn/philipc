'use client'

import React, { useState } from "react";
import { UserSession, User} from '@/app/data/types';
import Navigation from '@/app/components/Navigation';

// etong function na to laman yung galing sa lib/queries, which is yung gumagawa ng sql update mismo 
import { update } from './actions';

// fetch natin yung user information then display sa page, then lagay tayo ng parang button na maglalabas ng input thingy para maedit na yung page ganun

const CreateSettingsPage: React.FC = () => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [username, setUsername] = useState<String>("");
    const [id, setId] = useState<Number>();

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
            console.log(data.data.user);
            setUserInfo(data.data.user || null);
          }
        } catch (err) {
          console.error('Failed to fetch user info', err);
        }
      };
      
      fetchUserInfo();
    }, [user]);

    
      
  return (
    <>
      <div className="min-h-screen dark:bg-gray-800">
        <Navigation />
        <div className="mx-auto max-w-7xl p-6">
          <div>Name: {userInfo?.first_name} {userInfo?.last_name}</div>
          <div>Username: {userInfo?.username}</div>
          <div>Email: {userInfo?.email}</div>
          <div>Show password: {userInfo?.password}</div>

          <form action={update}>
            <input type="hidden" name="id" value={id ?? ""}></input>
            <div className="row">
              <input name="username" placeholder="Change username"></input><button>Change</button>
            </div>
            <div className="row">
              <input name="email" placeholder="Change email"></input><button>Change</button>
            </div>
            <div className="row">
              <input name="password" placeholder="Change password"></input><button>Change</button>
            </div>
          </form>
        </div>
      </div>
    </>
    
  );
}

export default CreateSettingsPage;