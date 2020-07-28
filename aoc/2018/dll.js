class Node {
  constructor(value) {
    // next, prev will be set by list
    this.value = value
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  add(value) {
    const node = new Node(value)
    // special case: no nodes in the list yet
    if (this.head === null) {
      this.head = node
    } else {
      // link the current tail and new tail
      this.tail.next = node;
      node.previous = this.tail;
    }

    this.length ++
    this.tail = node;
  }

  rotate(i) {
    if (this.length <2) {
      // cannot rotate
      return
    }
    if (i < 0) {
      while (i++) {
        this.tail = this.head
        this.head = this.head.next
      }
    } else {
      while (i++) {
        this.head = this.tail
        this.tail = this.tail.prev
      }
    }
  }
  print() {
  }
}