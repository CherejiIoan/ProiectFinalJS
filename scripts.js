var users = {};


function populateUsersList() {

	    for (var i=0; i < _users.length; i++) {
		
		var cu = _users[i];

		var status

		if(Math.floor(Math.random() * 2) == 0){
			status = false
		} else {
			status = true
		}

		var	user = {
			id: cu.id,
			name: cu.name,
			username: cu.username,
			email: cu.email,
			address: cu.address,
			phone: cu.phone,
			website: cu.website,
			company: cu.company,
			friends: cu.friends,
			active: status
		}		
		users[user.id] = user
	} 
    
}

var messages = []
function populateMessage () {
	for (var i=0; i<_messages.length; i++) {
		var message = {
			send: _messages[i].send,
			received: _messages[i].received,
			text: _messages[i].text
		}
		messages.push(message)
	}
}

var posts = []
function populatePostsList () {
	
	for (var i=0; i<_posts.length; i++) {
	
		var post = {
			userId: _posts[i].userId,
			id: _posts[i].id,
			text: _posts[i].text,
			likes: _posts[i].likes,
			date: _posts[i].date,
			comments: []
		}
		posts.push(post)
	}
}

var comments = {}
function populateComments () {
	for(var i=0; i<_comments.length; i++) {
		var cc = _comments[i];

		var comment = {
			id: cc.id,
			userId: cc.userId,
			postId: cc.postId,
			text: cc.text,
		}
	if(comment.postId in comments) {
		comments[comment.postId].push(comment)
	} else {
		comments[comment.postId] = [],
		comments[comment.postId].push(comment)
	}
	}
}

populateUsersList();
populatePostsList();
populateMessage();
populateComments();

function onStart(){
	var container = document.querySelector("#logIn-container");
	console.log(users.length)
	for (var [key,value] of Object.entries(users)){
		console.log(users[key].name)		
		if (users[key].active == true){
			$(`<div id="user-${key}" class="users-select online-user">
					<img src="img/user.png">
					<span class="users-select-name">${value.name}</span>
		   </div>`).appendTo(container);
		} else {
			$(`<div id="user-${key}" class="users-select">
					<img src="img/user.png">
					<span class="users-select-name">${value.name}</span>
		   </div>`).appendTo(container);
		}
		
	}

	var userSelectList = document.querySelectorAll(".users-select.online-user");
	for (var i = 0; i<userSelectList.length; i++){
		let el = userSelectList[i];
		console.log(el.id)
		el.addEventListener("click", function(){
			login(parseInt(el.id.split('-')[1]))
		}, false)
	}
}
onStart();

var loginId = 0

function login(userId){

	var logIn= document.querySelector(".logIn");
	logIn.classList.remove("visible");
	

	loginId = userId

	document.getElementById("header-username").innerHTML = users[userId].name
	document.getElementById("side-username").innerHTML = users[userId].name

	posts.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));

	showFriendsPosts()
	var friends = users[loginId].friends;
	for (var i=0; i<friends.length; i++){
		var fr = users[friends[i]];
		createFriend(fr)
	}
	populateUserMessages();
	createInbox();
	showAdds();
}


document.getElementById("side-username").addEventListener("click",showMyPosts,false)

function showMyPosts () {	
	var container = document.querySelector("main");
	container.innerHTML=""
	for ( var i = 0; i < posts.length; i++) {
		if (loginId == posts[i].userId){
			createPost(posts[i])
		}
	} 

}
document.getElementById("logo").addEventListener("click",showFriendsPosts,false)

function showFriendsPosts () {
	var container = document.querySelector("main");
	container.innerHTML=""
	var friends = users[loginId].friends
	var friendsPosts = []

	for (var i = 0; i < posts.length; i++){
		var cp = posts[i]

		if (friends.includes(cp.userId)){
			friendsPosts.push(cp)
		} 
	}


	for (var j = 0; j < friendsPosts.length; j++) {
		createPost(friendsPosts[j])
	}
}
document.getElementById("friends-button").addEventListener("click",showFriends,false)
document.getElementById("fr-close-button").addEventListener("click",hideFriends,false)


function showFriends () {
	var overlayer= document.getElementById("overlayer");
	overlayer.classList.add("visible");
	
	var friends_modal= document.getElementById("friends-list-modal");
	friends_modal.classList.add("visible");
	
}

function hideFriends () {
	var overlayer= document.getElementById("overlayer");
	overlayer.classList.remove("visible");

	var friends_modal= document.getElementById("friends-list-modal");
	friends_modal.classList.remove("visible");
}

function showMsg () {
	var overlayer= document.getElementById("overlayer");
	overlayer.classList.add("visible");
	
	var messages_modal= document.getElementById("messages-list-modal");
	messages_modal.classList.add("visible");
}

function hideMsg () {
	var overlayer= document.getElementById("overlayer");
	overlayer.classList.remove("visible");

	var messages_modal= document.getElementById("messages-list-modal");
	messages_modal.classList.remove("visible");
}

document.getElementById("messages-button").addEventListener("click",showMsg,false)
document.getElementById("msg-close-button").addEventListener("click",hideMsg,false)


function createFriend(friend) {
	var container = document.getElementById("friends-list");
	$(`<div class="friends-profil">
			<img src="img/user.png" alt="">
			<span>${friend.name}</span>
		</div>`).appendTo(container)
}



var userMessages = {}
function populateUserMessages() {
	for (var i=0; i<messages.length; i++) {
		if (loginId == messages[i].send || loginId == messages[i].received){
			var message = {
				send: messages[i].send,
				received: messages[i].received,
				text: messages[i].text
			} 
			
			var friendId;
			if (loginId == messages[i].send){
				friendId = messages[i].received
			} else {
				friendId = messages[i].send
			}

			if (friendId in userMessages){
				userMessages[friendId].push(message)
			} else { 
				userMessages[friendId] = []
				userMessages[friendId].push(message)
			}
		}
	}
}

function createInbox (){
	var container = document.querySelector(".friends-msg");
	
	for (var [key,value] of Object.entries(userMessages)){
		console.log(users[key].name)
		$(`<div class="modal-user-details" id="friend-${key}">
							<img src="img/user.png" alt="">	
							<span>${users[key].name}</span>
						</div>)`).appendTo(container)
	} 

	var usersMsgList = document.querySelectorAll(".modal-user-details");
	for (var i = 0; i<usersMsgList.length; i++){
		let el = usersMsgList[i];
		el.addEventListener("click", function(){
			createMessageArhive(parseInt(el.id.split('-')[1]))

			for (var j = 0; j<usersMsgList.length; j++){
				if (usersMsgList[j] == el){
					usersMsgList[j].classList.add("active-user")
				}
				else{
					usersMsgList[j].classList.remove("active-user")
				}
			}

		}, false)
	}
}

function createSendMsg (message) {
	var container = document.querySelector(".messages-msg");
	$(`<div class="msg send">${message}</div>`).appendTo(container)
}
function createReceivedMsg (message) {
	var container = document.querySelector(".messages-msg");
	$(`<div class="msg received">${message}</div>`).appendTo(container)
}

function createMessageArhive (friendId) {
	document.querySelector(".messages-msg").innerHTML = " "
	for (var i=0; i<userMessages[friendId].length; i++) {
		var cm = userMessages[friendId][i];
		if (loginId == cm.send){
			createSendMsg(cm.text)
		} else {
			createReceivedMsg(cm.text)
		}
	}

} 


function createPost(post){
	var container = document.querySelector("main");
	// container.append(article)

	$(`<article id=post-${post.id}>
		<div class="header row">
			<div class="user-image">							
				<a href="#">
			 	 <img src="http://placehold.it/300x300" alt="">
				</a>
			</div>
			<div class="user-info">
				<a href="#" class="username">${users[post.userId].name}</a>
				<a href="#" class="post-date">${post.date}</a>
			</div>
			<i class="fa fa-ellipsis-v post-menu"></i>
		</div>

		<div class="content">

			<p>${post.text}</p>
		</div>

		<div class="actions">
			<ul class="row">
				<li>
					<a href="#">
						<i class="fa fa-thumbs-up"> ${post.likes}</i>
					</a>
				</li>
				<li>
					<a href="#">
						<i class="fa fa-thumbs-down"></i>
					</a>
				</li>
				<li>
					<a href="#">
						<i class="fa fa-commenting"></i>
					</a>
				</li>
				<li>
					<a href="#">
						<i class="fa fa-ban"></i>
					</a>
				</li>
				<li>
					<a href="#">
						<i class="fa fa-share-alt"></i>
					</a>
				</li>
			</ul>
		</div>
		<div class="comments-section">
			<form class="post-comment">
				<input type="text">
				<button>
					<i class="fa fa-send"></i>
				</button>
			<div class="comments-list">
				
			</div>

		</div>
				
			</form>
	</article>`).appendTo(container)

	if (post.id in comments) {
		for (var i=0; i<comments[post.id].length; i++){
			createComment(post.id,comments[post.id][i])
		}
	}

}



function createComment (pId,com) {
	var container = document.querySelector(`#post-${pId} .comments-section`);

	$(`<div class="comment">
			<div class="comment-user">
				<img src="img/user.png" alt="" />
				<a href="">${users[com.userId].name}</a>
			</div>	
			<p>${com.text}</p>
		</div>`).appendTo(container)
} 

function showAdds () {
	var adds = []
	for (var i=0; i<_adds.length; i++) {
		adds.push(_adds[i].addLink);
	}
	var noAdds = Math.floor(Math.random() * 4) + 1;
	while (noAdds > 0){
		var ranAdd = Math.floor(Math.random() * adds.length);
		createAdd(adds[ranAdd]);
		noAdds = noAdds-1;
	}



}


function createAdd (addLink){
	var container = document.querySelector(".container-add");
	$(`<img src="${addLink}" alt="Image"/>`).appendTo(container)
}


