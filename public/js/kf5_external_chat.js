function KF5_StartChat()
{
	var KF5_Chat_Url = document.getElementById("kf5_chat").getAttribute('name');
	window.open(KF5_Chat_Url+"/livechat/info","chat","width=650,height=560,toolbar=no, menubar=no, scrollbars=no");
}
document.getElementById("kf5_chat").setAttribute("onclick","KF5_StartChat()");