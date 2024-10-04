export const LOCAL_USER = "user_session";
const url: string = window.location.href;
const arr: string[] = url.split("/");
const newurl: string[] = arr[2].split(":");
export const SERVER_URI = `https://retail2.playbetman2.com/api/api/v1/`;
export const defaultStake = 10.0;
