import { useState } from "react";
import { ConfirmModal } from "../components/modal-component";

export default function SidebarWithColor() {
    const [isOpenSignOut,setIsOpenSignOut] = useState<boolean>(false)
    return (
        <>
            <aside className="w-15 bg-[#27a082] text-white flex flex-col justify-between p-4">
                <div className="space-y-4 mt-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv cursor-pointer"><g id="m-q/notifications"><path id="Vector" d="M17.9111 12.8C17.2444 12.8 16.5778 12.6222 15.9556 12.3111C14.6667 11.6444 13.8222 10.2667 13.8222 8.75556C13.8222 7.73333 14.1778 6.8 14.8889 6.04444C15.6444 5.2 16.7556 4.71111 17.9111 4.71111C20.1778 4.71111 22 6.53333 22 8.75556C22 10.9778 20.1778 12.8 17.9111 12.8ZM15.9556 13.3333C15.9556 14.0444 16.1778 16.0889 18.4 16.8444V18.9778H2V16.8444C4.71111 15.9111 4.44444 13.0667 4.44444 13.0667V10V9.86667C4.48889 7.15556 6.48889 4.88889 9.11111 4.35556C9.82222 4.22222 10.5778 4.22222 11.3333 4.35556C12.3111 4.53333 13.2444 4.97778 14.0444 5.64444C13.3333 6.53333 12.9333 7.6 12.9333 8.71111C12.9333 10.8 14.1778 12.5778 15.9556 13.3333ZM9.11111 3.64444V3.11111C9.11111 2.48889 9.6 2 10.2222 2C10.8 2 11.3333 2.48889 11.3333 3.11111V3.64444C10.9778 3.6 10.5778 3.55556 10.2222 3.55556C9.82222 3.55556 9.46667 3.6 9.11111 3.64444ZM10.5333 19.6889H12.7556C12.6667 20.9778 11.5556 22 10.2222 22C8.88889 22 7.77778 20.9778 7.68889 19.6889H10.5333Z" fill="currentColor"></path></g></svg>
                    <svg onClick={() => { setIsOpenSignOut(true) }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv cursor-pointer core_helpIcon_1smntdnyha"><g id="e-h/help"><g id="help" clip-path="url(#clip0_15_100)"><g id="Group"><path id="Vector" d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM11.7 18C10.8 18 10.2 17.4 10.2 16.5C10.2 15.7 10.8 15.1 11.6 15.1C12.5 15.1 13 15.7 13 16.6C13.1 17.4 12.5 18 11.7 18ZM15.2 11C15 11.3 14.6 11.6 14 12L13.4 12.4C13.1 12.7 12.9 12.9 12.8 13.1C12.8 13.2 12.7 13.3 12.7 13.4C12.7 13.8 12.4 13.8 12.4 13.8H10.9C10.9 13.8 10.5 13.9 10.5 13.2C10.5 12.6 10.6 12.3 10.9 12C11.4 11.4 12.6 10.7 12.6 10.6C12.8 10.5 12.9 10.3 13 10.2C13.2 9.9 13.3 9.6 13.3 9.4C13.3 9 13.2 8.7 13 8.4C12.8 8.2 12.4 8 11.8 8C11.3 8 10.9 8.2 10.7 8.6C10.5 8.9 10.3 9.3 10.3 9.7V9.8H8V9.7C8.1 8.3 8.6 7.2 9.5 6.6C10.1 6.2 10.9 6 11.7 6C12.8 6 13.8 6.3 14.6 6.8C15.4 7.4 15.8 8.2 15.8 9.3C15.8 9.9 15.6 10.5 15.2 11Z" fill="currentColor"></path></g></g></g><defs><clipPath id="clip0_15_100"><rect width="20" height="20" fill="white" transform="translate(2 2)"></rect></clipPath></defs></svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer"><g id="i-l/logout"><g id="ic_wyloguj"><g id="wyloguj"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22.001 12 22.001C17.523 22.001 22.001 17.523 22.001 12C22.001 6.477 17.523 2 12 2ZM12.977 4.097V9.341H11.023V4.097H12.977ZM12 18.939C8.16952 18.9346 5.06541 15.8305 5.061 12C5.061 9.043 6.925 6.518 9.537 5.521V7.672C7.98006 8.55704 7.01738 10.2091 7.015 12C7.01831 14.7518 9.24823 16.9817 12 16.985C14.752 16.9822 16.9822 14.752 16.985 12C16.9826 10.2094 16.0204 8.55745 14.464 7.672V5.521C17.076 6.518 18.939 9.043 18.939 12C18.9346 15.8305 15.8305 18.9346 12 18.939Z" fill="currentColor"></path></g></g></g></svg>
                    <img
                        className='rounded-full cursor-pointer'
                        src="https://calamari-prod-avatars-eu-west-1.s3.amazonaws.com/38293/90de9e720a098f3fdce7049a798bb623.1Yf8r6AqopaNcmLExJrEKtrq1.png" alt="admin orathsa"
                    />
                </div>
            </aside>

            <ConfirmModal
                isOpen={isOpenSignOut}
                title="vous allez vous deconnecté"
                description="Votre session sera supprimer!!"
                cancelText="Annuler"
                confirm={() => setIsOpenSignOut(false)}
                cancel={() => { setIsOpenSignOut(false) }}
                confirmText="accepter"
            />
        </>
    );
}
