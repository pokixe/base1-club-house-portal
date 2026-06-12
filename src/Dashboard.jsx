import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    members: 0,
    files: 0,
    events: 0,
  });

  useEffect(() => {
    getUser();
    loadStats();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function loadStats() {
    const { count: members } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: files } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true });

    const { count: events } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    setStats({
      members: members || 0,
      files: files || 0,
      events: events || 0,
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Base1 Club House Dashboard</h1>
          <p className="text-gray-500">Welcome {user?.email}</p>
        </div>

        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Members</h3>
          <p className="text-4xl font-bold">{stats.members}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Files</h3>
          <p className="text-4xl font-bold">{stats.files}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Events</h3>
          <p className="text-4xl font-bold">{stats.events}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white p-4 rounded-lg">
            Upload File
          </button>

          <button className="bg-green-600 text-white p-4 rounded-lg">
            Add Member
          </button>

          <button className="bg-purple-600 text-white p-4 rounded-lg">
            Create Event
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

        <ul className="space-y-2">
          <li>📁 New file uploaded</li>
          <li>👤 New member registered</li>
          <li>📅 Event created</li>
        </ul>
      </div>
    </div>
  );
}
