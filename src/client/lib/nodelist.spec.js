import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { checkNodeList, getNodeLists, removeNodesByAttr } from './nodelist';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('nodeListHelpers', () => {
  describe('checkNodeList()', () => {
    it('Should return -1 when list is empty', () => {
      const nodeList = document.querySelectorAll('.none');

      checkNodeList(nodeList).should.equal(-1);
    });

    it('Should return list when list isn\'t empty', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      const nodeList = document.querySelectorAll('div');

      checkNodeList(nodeList).should.equal(nodeList);
    });
  });

  describe('getNodeLists()', () => {
    it('Should throw Error when not passed an Array of strings', () => {
      return expect(Promise.resolve({ foo: "bar" })).to.eventually.have.property("bar");
    });
  });

  describe('removeNodesByAttr()', () => {
    it('Should throw Error if attr or val aren\'t supplied', () => {

    });

    it('Should return an empty Array if supplied an empty NodeList', () => {
      const nodeList = document.querySelectorAll('.none');

      removeNodesByAttr(nodeList, 'method', 'post').should.deep.equal([]);
    });

    it('Should return NodeList as Array if no matches are found', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      const nodeList = document.querySelectorAll('div');

      removeNodesByAttr(nodeList, 'method', 'post').should.deep.equal(Array.from(nodeList));
    });

    it('Should return filtered NodeList as Array if matches are found', () => {

    });
  });
});
