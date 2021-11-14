import LottoContainer from './components/LottoContainer'
import ClassName from './constants/ClassName'
import CypressDom from './constants/CypressDom'
import ElementId from './constants/ElementId'
import Event from './constants/Event'
import EventType from './constants/EventType'
import LottoService from './service/LottoService'
import { $ } from './utils/dom'

const clickEventMapper = {
  [EventType.purchase]: (lottoService) => onLottoPurchase(lottoService),
  [EventType.checkMyLottoResult]: () => onCheckMyLottoResult(),
  [EventType.toggleMyLotto]: () => onToggleMyLottoNumber(),
}

export default class App {
  #rootContainer
  #lottoService

  constructor() {
    this.#rootContainer = $('#' + ElementId.luckyLottoContainer)
    this.#lottoService = new LottoService()
    new LottoContainer(this.#rootContainer)

    this.setEvent()
  }

  setEvent() {
    this.#rootContainer.addEventListener(Event.onClick, (event) => {
      const clickEvent = event.target.dataset.event

      if (!clickEvent) {
        return
      }

      clickEventMapper[clickEvent](this.#lottoService)
    })
  }
}

function onLottoPurchase(lottoService) {
  console.log('I buy Lotto!')

  const money = Number($('#' + ElementId.purchaseInput).value)

  if (money === 0 || money % lottoService.lottoPrice !== 0) {
    alert(lottoService.lottoPrice + '원 단위로 입력해주세요.')
    return
  }

  const lottoAmount = money / lottoService.lottoPrice

  lottoService.autoPurchase(lottoAmount)

  setLottoViewVisible()

  handlePurchaseLotto(lottoService.myLottos)
}

function onCheckMyLottoResult() {
  console.log('Check my Lotto Result!')
}

function onToggleMyLottoNumber() {
  const viewer = $('#' + ElementId.purchasedLottoViewer)

  const isVisible = viewer.dataset.visible === 'visible' ? true : false
  console.log(isVisible)
  const details = document.querySelectorAll('.lotto-detail')

  details.forEach((detail) => {
    detail.style.display = isVisible ? 'none' : ''
  })

  viewer.dataset.visible = isVisible ? 'hidden' : 'visible'
}

function setLottoViewVisible() {
  $('#' + ElementId.purchasedLotto).classList.remove(ClassName.displayNone)
  $('#' + ElementId.lottoAnswerInput).classList.remove(ClassName.displayNone)
}

function handlePurchaseLotto(lottoNumbers) {
  const template = (numbers) => {
    return `
      <li class="mx-1 text-4xl lotto-wrapper">
      <span class="lotto-icon">🎟️ </span>
      <span class="lotto-detail" style="display: none;" data-test-element="${
        CypressDom.lottoDetail
      }"">${numbers.reduce((a, b) => a + ', ' + b)}</span>
      </li>
    `
  }

  $('#' + ElementId.purchasedLottoViewer).innerHTML = `${lottoNumbers
    .map((lottoNumber) => template(lottoNumber))
    .join('')}`

  $(
    '#' + ElementId.purchasedLottoAmountLabel
  ).innerText = `총 ${lottoNumbers.length}개를 구매하였습니다.`

  $('#' + ElementId.purchasedLottoAmountLabel).dataset.count =
    lottoNumbers.length
}
