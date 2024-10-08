import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import toast from 'react-hot-toast';
import { BiLogOut } from 'react-icons/bi';
import { FaUser, FaUsers } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import { MdHomeFilled } from 'react-icons/md';
import { Link } from 'react-router-dom';
import XSvg from '../svgs/X';


function TopPanel() {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient=useQueryClient();
     
	  
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
  return (
    <div className='topBar sm:hidden block'>
      <ul className='flex flex-row  mt-4  mb-5 gap-9 items-center' >
      <Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center  transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center  transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center  transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
						</Link>
					</li>
					<li className='flex justify-center md:justify-start lg:hidden'>
						<Link
							to={`/suggestedUsers`}
							className='flex gap-3 items-center  transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUsers
                            className='w-6 h-6' />
						</Link>
					</li>
                    <li>
                    <BiLogOut
								className='w-5 h-5 cursor-pointer ele'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
                    </li>
                    
				</ul>
                
                    <Link
						to={`/profile/${authUser.username}`}
						className='mt-5 mb-5 flex gap-2   items-center transition-all duration-300 hover:bg-[#181818] py-2 px-2 rounded-full'
					>
						<div className='avatar  '>
							<div className='w-8 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className=' block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
							</div>
							
						</div>
					</Link>
    </div>
  )
}

export default TopPanel
