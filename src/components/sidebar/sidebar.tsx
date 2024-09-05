import React, { useState } from 'react';
import { NavbarContainer, NavbarLink, LogOutNavbarLink } from './components';
import { AiOutlineHome, AiOutlineForm , AiOutlineUser, AiOutlineTool, AiOutlineSchedule, AiOutlineLogout, AiOutlineDatabase, AiOutlineGroup } from "react-icons/ai";

const handleLogout = () => {
    window.location.href = '/';
}

const SideBar: React.FC = () => {

    const [user] = useState<{ name: string; role: 'admin' | 'teacher' | 'student' }>({
        name: 'John Doe',
        role: 'teacher',
    });

    return (
        <NavbarContainer>
            <NavbarLink title='Home' to="/home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome /></NavbarLink>

            {(user.role === 'teacher' || user.role === 'admin') && (
                <>
                <NavbarLink title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule /></NavbarLink>
                <NavbarLink title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  /></NavbarLink>
                </>
            )}

            {(user.role === 'student' || user.role === 'admin') && (
                <>
                <NavbarLink title='My classes' to="/my-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineGroup  /></NavbarLink>
                <NavbarLink title='Browse available classes' to="/browse-available-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineDatabase /></NavbarLink>
                </>
            )}

            <NavbarLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser /></NavbarLink>
            <NavbarLink title='Settings' to="/settings" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineTool /></NavbarLink>
            <LogOutNavbarLink to="/" onClick={handleLogout}><AiOutlineLogout /></LogOutNavbarLink>
        </NavbarContainer>
    );
};

export default SideBar;
