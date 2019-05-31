document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#register');
  const input = document.querySelector('input');
  const ul = document.querySelector('#invitedList');

  const mainDiv= document.querySelector('.main');
  const hideDiv = document.createElement('div');
  const hideLabel = document.createElement('label');
  hideLabel.textContent = "Hide who haven't responded"
  const hideCheckBox = document.createElement('input');
  hideCheckBox.type="checkBox";
  hideDiv.appendChild(hideLabel);
  hideDiv.appendChild(hideCheckBox);
  mainDiv.insertBefore(hideDiv,ul);

  //Local Storage 가 있는지 확인
  function supportLocalStorage() {
    return 'localStorage' in window || window[localStorage] !== null;
  }
  // Local Storage에 있는 값 읽기
  function getInvitees() {
    let inviteesList = localStorage.getItem('inviteesList');
    if(inviteesList){
      return JSON.parse(inviteesList);
    } else {
      return [];
    }
  }

  // Local storage에 값 저장하기
  function saveInvitees(str) {
    let inviteesList = getInvitees();
    if(!str || inviteesList.indexOf(str) > -1 ) {
      return false;
    }
    inviteesList.push(str);
    localStorage.setItem('inviteesList',JSON.stringify(inviteesList));
  }

  // Local storage에 값 수정하기
  function editInvitees(element) {
    function getEditedIndex(element) {
      for(let i =0 ; i <element.parentNode.childNodes.length; i ++) {
        if(element === element.parentNode.childNodes[i]){
          return i;
        }
      }
      console.log('Cannot figure out the index');
    }
    let inviteesList = getInvitees();
    const elementText= element.firstElementChild.textContent;
    const editedIndex = getEditedIndex(element);
    inviteesList[editedIndex] = elementText;
    localStorage.setItem('inviteesList',JSON.stringify(inviteesList));
  }

  // Local storage값 삭제하기
  function removeInvitee(element) {
    let inviteesList = getInvitees();
    const elementText= element.firstElementChild.textContent;
    const newInvitees = inviteesList.filter(invitee => invitee !== elementText)
    localStorage.setItem('inviteesList',JSON.stringify(newInvitees));
  }
  // 윈도우가 실행이되면 바로 실행될 코드
  window.onload = function() {
    let inviteesList = getInvitees();
    if(supportLocalStorage()){
      inviteesList.forEach(function(text){
        console.log(text);
        ul.appendChild(createLI(text));
      });

    }
  }
  window.onunload = function() {
    console.log('onunload');
  }
  // 윈도우가 reload 될때

  //Hide who haven't responded 체크박스 이벤트 핸들러
  hideCheckBox.addEventListener('change', (e) => {
    const isChecked = hideCheckBox.checked;
    const lis = ul.children;
    if(isChecked) {
      for(let i=0; i < lis.length; i++){
        const li = lis[i];
        if(li.className === "responded"){
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      }
    } else {
      for(let i=0; i < lis.length; i++){
        const li = lis[i];
          li.style.display = '';
      }
    }
  });

  //List box 만들기
  function createLI(text) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }
    function appendToLI(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement('li');
    appendToLI('span', 'textContent', text);
    appendToLI('label', 'textContent', 'Confirmed')
      .appendChild(createElement('input', 'type', 'checkBox'));
    appendToLI('button','textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');

    return li;
  }

  //입력창 submit 누르면 createLI 함수 실행
  form.addEventListener('submit', (e)=>{
    e.preventDefault();// Submit 이벤트 발생시 리로드 되는 기본 설정이 실행되지 않게해준다.
    if(input.value == "") {
      alert('Please type the name');
    } else if(getInvitees().indexOf(input.value) > -1 ){
      alert('He(she) is already on the list');
    } else {
      const text = input.value;
      input.value ='';
      const li = createLI(text);
      ul.appendChild(li);
      saveInvitees(text);
    }

  });

  //Li box 체크박스 체크 여부에따라 랜더링 변경
  ul.addEventListener('change', (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;

    if(checked) {
      listItem.className = 'responded';
    } else {
      listItem.className = '';
    }
  });


  // Li box 버튼 컨트롤( remove, edit , save )
  ul.addEventListener('click', (e)=>{
    if(e.target.tagName === 'BUTTON'){
      const button = e.target;
      const buttonName = button.textContent;
      const listItem = button.parentNode;
      const actions = {
        remove: () => {
          listItem.parentNode.removeChild(listItem);
          removeInvitee(listItem);
        },
        edit:() => {
          const span = listItem.firstElementChild;
          const input = document.createElement('input');
          input.type = "text";
          input.value = span.textContent;
          listItem.insertBefore(input,span);
          listItem.removeChild(span);
          button.textContent ="save";
        },
        save:() => {
          const input = listItem.firstElementChild;
          const span = document.createElement('span');
          span.textContent= input.value;
          listItem.insertBefore(span,input);
          listItem.removeChild(input);
          button.textContent="edit";
          editInvitees(listItem);
        }
      };
      actions[buttonName]();
    }
  });

});
