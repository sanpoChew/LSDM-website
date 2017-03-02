import { removeNodesByAttr } from 'client/lib/nodelist';

function attachPostListener() {

}

export default function attachListeners(lists) {
  Object.keys(lists).forEach((name) => {
    switch (name) {
      case 'form':
        attachPostListener(removeNodesByAttr(lists.name, 'method', 'post'));
        break;
      default:
    }
  });
}
