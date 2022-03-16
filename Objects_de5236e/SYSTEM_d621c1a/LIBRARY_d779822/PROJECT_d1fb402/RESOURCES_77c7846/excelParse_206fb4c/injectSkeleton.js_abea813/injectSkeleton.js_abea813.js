function inject(service) {
	var res = {
	Mud : `
		<div id="root">
		<div class="rooter" id="container">
		  <div id="block1">
			<div class="row">
			  <div class="cell">
				Заказчик :
			  </div>
			  <div class="cell" id="Заказчик:"></div>
			  <div class="cell">
				Месторождение :
			  </div>
			  <div class="cell" id="Месторождение:"></div>
			  <div class="cell">
				Глубина/По верт. :
			  </div>
			  <div class="cell" id="Глубина/Поверт.:"></div>
			</div>
			<div class="row">
			  <div class="cell">
				Супервайзер :
			  </div>
			  <div class="cell" id="Супервайзер:"></div>
			  <div class="cell">
				Назначение :
			  </div>
			  <div class="cell" id="Назначение:"></div>
			  <div class="cell">
				Дата :
			  </div>
			  <div class="cell" id="Дата:"></div>
			</div>
			<div class="row">
			  <div class="cell">
				Скважина :
			  </div>
			  <div class="cell" id="Скважина:"></div>
			  <div class="cell">
				Регион :
			  </div>
			  <div class="cell" id="Регион:"></div>
			  <div class="cell">
				Дата начала скв. :
			  </div>
			  <div class="cell" id="Датаначаласкв.:"></div>
			</div>
			<div class="row">
			  <div class="cell">
				Подрядчик :
			  </div>
			  <div class="cell" id="Подрядчик:"></div>
			  <div class="cell">
				Пласт :
			  </div>
			  <div class="cell" id="Пласт:"></div>
			  <div class="cell">
				Тип раствора :
			  </div>
			  <div class="cell" id="Типраствора:"></div>
			</div>
			<div class="row">
			  <div class="cell">
				Бур. мастер :
			  </div>
			  <div class="cell" id="Бур.мастер:"></div>
			  <div class="cell">
				Номер скв. :
			  </div>
			  <div class="cell" id="Номерскв.:"></div>
			  <div class="cell">
				Текущие работы :
			  </div>
			  <div class="cell" id="Текущиеработы:"></div>
			</div>
			<div class="colRow">
			  <div class="col lumn" style="width: 25%">
				<div class="cell colname" style="width:100%;float:left;">
				  БУРИЛЬНАЯ КОЛОННА
				</div>
				<div class="cell col" id="БУРИЛЬНАЯКОЛОННА" style="width:100%;"></div>
				
			  </div>
			  <div class="col lumn" style="width: 25%">
				<div class="cell colname" style="width:100%;float:left;">
				  КОНСТРУКЦИЯ СКВАЖИНЫ
				</div>
				<div class="cell col" id="КОНСТРУКЦИЯСКВАЖИНЫ" style="width:100%;"></div>
			  </div>
			  <div class="col lumn" style="width: 25%">
				<div class="cell colname" style="width:100%;float:left;">
				  ОБЪЕМЫ РАСТВОРА (м3)
				</div>
				<div class="cell col" id="ОБЪЕМЫРАСТВОРА(м3)" style="width:100%;"></div>
			  </div>
			  <div class="col lumn" style="width: 25%">
				<div class="cell colname" style="width:100%;float:left;">
				  ДАННЫЕ ЦИРКУЛЯЦИИ РАСТВОРА
				</div>
				<div class="cell col" id="ДАННЫЕЦИРКУЛЯЦИИРАСТВОРА" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow">
			  <div class="col lumn" style="width: 50%">
				<div class="cell colname" style="width:100%;float:left;">
				  ПАРАМЕТРЫ РАСТВОРА
				</div>
				<div class="cell col" id="ПАРАМЕТРЫРАСТВОРА" style="width:100%;"></div>
				<div class="col lumn" style="width: 100%">
				  <div class="cell colname" style="width:100%;float:left;">
					ПРОЕКТНЫЕ ПАРАМЕТРЫ РАСТВОРА
				  </div>
				  <div class="cell col" id="ПРОЕКТНЫЕПАРАМЕТРЫРАСТВОРА" style="width:100%;"></div>
				</div>
			  </div>
			  <div class="col lumn" style="width: 50%">
				<div class="cell colname" style="width:100%;float:left;">
				  РАСХОД И ИНВЕНТАРИЗАЦИЯ
				</div>
				<div class="cell colname" style="width:100%;height: 4.7rem;display:grid;grid-template-columns: 1fr 1fr 1fr 3fr 1fr 1fr;">
				  <div class="cell collname" style="width:100%;height:100%;font-size: 10px;font-weight:400;border-right:1px solid #FFF">
					НАИМЕНОВАНИЕ
				  </div>
				  <div class="cell collname" style="width:100%;height:100%;font-size: 10px;font-weight:400;border-right:1px solid #FFF">
					УПАКОВКА,
					 кг
				  </div>
				  <div class="cell collname" style="width:100%;height:100%;font-size: 10px;font-weight:400;border-right:1px solid #FFF">
					Приход
					ВСЕГО
				  </div>
				  <div class="cell collname" style="width:100%;height:100%;font-size: 11px;border-right:1px solid #FFF;display:flex;flex-direction:column;">
					За сутки
					<div style="width: 100%;height:100%;display:grid;grid-template-columns: repeat(3, 1fr);">
					  <div style="width: 100%;height:100%;border-right:1px solid #fff; border-top: 1px solid #fff;">
						Начало
					  </div>
					  <div style="width: 100%;height:100%;border-right:1px solid #fff; border-top: 1px solid #fff;">
						Приход
					  </div>
					  <div style="width: 100%;height:100%; border-top: 1px solid #fff;">
						Расход
					  </div>
					</div>
				  </div>
				  <div class="cell collname" style="width:100%;height:100%;font-size: 11px;border-right:1px solid #FFF">
					Расход ВСЕГО
				  </div>
				  <div class="cell collname" style="width:100%;height:100%;font-size: 11px;border-right:1px solid #FFF">
					ОСТАТОК
				  </div>
				</div>
				<div class="cell col" id="РАСХОДИИНВЕНТАРИЗАЦИЯ" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow">
			  <div class="col lumn" style="width: 100%">
				<div class="cell colname" style="width:100%;float:left;">
				  ОБОРУДОВАНИЕ ОЧИСТКИ РАСТВОРА
				</div>
				<div class="cell col" id="ОБОРУДОВАНИЕОЧИСТКИРАСТВОРА" style="width:100%;display:grid;grid-template-columns: repeat(5, 1fr);">
				  <div style="height: 100%;border-right: 1px solid #FFF;">
					<div class="cell colname" style="width:100%;float:left;">
					  ПАРАМЕТРЫ
					</div>
					<div class="cell col" id="ПАРАМЕТРЫ" style="width:100%;">
					  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Модель</div>
					  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Сетки</div>
					  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Время работы</div>
					  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Коэф. влажности шлама</div>
					  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Распределение шлама, %</div>
					</div>
				  </div>
				  <div>
					<div class="cell colname" style="width:100%;float:left;">
					  ВИБРОСИТО №1
					</div>
					<div class="cell col" id="ВИБРОСИТО№1" style="width:100%;"></div>
				  </div>
				  <div>
					<div class="cell colname" style="width:100%;float:left;">
					  ВИБРОСИТО №2
					</div>
					<div class="cell col" id="ВИБРОСИТО№2" style="width:100%;"></div>
				  </div>
				  <div>
					<div class="cell colname" style="width:100%;float:left;">
					  ВИБРОСИТО №3
					</div>
					<div class="cell col" id="ВИБРОСИТО№3" style="width:100%;"></div>
				  </div>
				  <div>
					<div class="cell colname" style="width:100%;float:left;">
					  СИТОГИДРОЦИКЛОН
					</div>
					<div class="cell col" id="СИТОГИДРОЦИКЛОН" style="width:100%;"></div>
				  </div>
				</div>
				<div class="col lumn" style="width: 100%"></div>
			  </div>
			  <!-- <div class="colname"></div> -->
			</div>
			<div class="colRow">
			  <div style="width:16.67%;border-right:1px solid #FFF;">
				<div class="cell colname" style="width:100%;float:left;">
				  ПАРАМЕТРЫ
				</div>
				<div class="cell col" id="ПАРАМЕТРЫ" style="width:100%;display:flex;flex-direction:column;justify-content:space-between">
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Модель</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Время работы ч.</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Коэф. влажности шлама м3/м3</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Давление на входе атм</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Плотность на входе г/см3</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Плотность на выходе г/см3</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Плотность пульпы г/см3</div>
				  <div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Разм/кол-во конусов мм/ шт.</div>
				</div>
			  </div>
			  <div style="width:16.67%">
				<div class="cell colname" style="width:100%;float:left;">
				  ИЛООТДЕЛИТЕЛЬ
				</div>
				<div class="cell col" id="ИЛООТДЕЛИТЕЛЬ" style="width:100%;"></div>
			  </div>
			  <div style="width:16.67%">
				<div class="cell colname" style="width:100%;float:left;">
				  ПЕСКООТДЕЛИТЕЛЬ
				</div>
				<div class="cell col" id="ПЕСКООТДЕЛИТЕЛЬ" style="width:100%;"></div>
			  </div>
			  <div style="width:16.67%">
				<div style="height: 100%;border-right: 1px solid #FFF;">
				  <div class="cell colname" style="width:100%;float:left;">
					ПАРАМЕТРЫ
				  </div>
				  <div class="cell col" id="ПАРАМЕТРЫ" style="width:100%;">
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Модель</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Время работы ч.</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Коэф. влажн. шлама м3/м3</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Подача насоса м3/час</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Плотн. на входе г/см3</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Плотн. на выходе г/см3</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Плотность пульпы г/см3</div>
					<div class="cell" style="width:100%;height:calc(2.3rem + 1px);border-bottom: 1px solid #FFF;">Скорость вращения об/мин</div>
				  </div>
				</div>
				<!-- <div class="cell col" id="ПАРАМЕТРЫ" style="width:100%;"></div> -->
			  </div>
			  <div style="width:16.67%">
				<div class="cell colname" style="width:100%;float:left;">
				  ЦЕНТРИФУГА №1
				</div>
				<div class="cell col" id="ЦЕНТРИФУГА№1" style="width:100%;"></div>
			  </div>
			  <div style="width:16.67%">
				<div class="cell colname" style="width:100%;float:left;">
				  ЦЕНТРИФУГА №2
				</div>
				<div class="cell col" id="ЦЕНТРИФУГА№2" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow">
			  <div style="width:50%">
				<div class="cell colname" style="width:100%;float:left;">
				  КОММЕНТАРИИ ПО РАСТВОРУ
				</div>
				<div class="cell col" id="КОММЕНТАРИИПОРАСТВОРУ" style="width:100%;"></div>
			  </div>
			  <div style="width:50%">
				<div class="cell colname" style="width:100%;float:left;">
				  КОММЕНТАРИИ ПО РАБОТАМ
				</div>
				<div class="cell col" id="КОММЕНТАРИИПОРАБОТАМ" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow">
			  <div style="width:50%">
				<div class="cell colname" style="width:100%;float:left;">
				  КОММЕНТАРИИ ПО ОБОРУДОВАНИЮ
				</div>
				<div class="cell col" id="КОММЕНТАРИИПООБОРУДОВАНИЮ" style="width:100%;"></div>
			  </div>
			  <div style="width:50%">
				<div class="cell colname" style="width:100%;float:left;">
				  ТЕХНИКА БЕЗОПАСНОСТИ
				</div>
				<div class="cell col" id="ТЕХНИКАБЕЗОПАСНОСТИ" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow"  style="border-bottom: 1px solid #FFF;border-right: 1px solid #FFF;">
			  <div style="width:25%">
				<div class="cell colname" style="width:100%;float:left;">
				  БАЛАНС ВРЕМЕНИ (24ч)
				</div>
				<div class="cell col" id="БАЛАНСВРЕМЕНИ(24ч)" style="width:100%;"></div>
			  </div>
			  <div style="width:25%" style="border-bottom: 1px solid #FFF;">
				<div class="cell colname" style="width:100%;float:left;">
				  БАЛАНС ОБЪЕМОВ (м3)
				</div>
				<!-- <div class="cell" style="width:100%;display:grid;grid-template-columns: repeat(4, 1fr);border-bottom:1px solid #FFF;">
				  <div class="cell" style="border-right: 1px solid #FFF;"> </div>
				  <div class="cell" style="border-right: 1px solid #FFF;">СУТ</div>
				  <div class="cell" style="border-right: 1px solid #FFF;">ИНТ</div>
				  <div class="cell" style="border-right: 1px solid #FFF;">СКВ</div>
				</div> -->
				<div class="cell col" id="БАЛАНСОБЪЕМОВ(м3)" style="width:100%;border-bottom: 1px solid #FFF;"></div>
				<div style="width:100%">
				  <div class="cell colname" style="width:100%;float:left;">
					ПОТЕРИ РАСТВОРА:
				  </div>
				  <div class="cell col" id="ПОТЕРИРАСТВОРА:" style="width:100%;"></div>
			   </div>
			 </div>
			  <div style="width:25%" style="border-bottom: 1px solid #FFF;">
				<div class="cell colname" style="width:100%;float:left;">
				  АНАЛИЗ ТВЕРДОЙ ФАЗЫ (%/кг/м3)
				</div>
				<div class="cell col" id="АНАЛИЗТВЕРДОЙФАЗЫ(%/кг/м3)" style="width:100%;"></div>
			  </div>
			  <div style="width:25%">
				<div class="cell colname" style="width:100%;float:left;">
				  РЕОЛОГИЯ И ГИДРАВЛИКА
				</div>
				<div class="cell col" id="РЕОЛОГИЯИГИДРАВЛИКА" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow">
			  <div style="width:100%">
				<div class="cell colname" style="width:100%;float:left;">
				  СТОИМОСТЬ СТРОИТЕЛЬСТВА СКВАЖИНЫ
				</div>
				<div class="cell collname" style="width:100%;font-size: 11px;border-right:1px solid #FFF;display:grid;grid-template-columns: 1fr 2fr 3fr 1fr;">
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
					
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
					Буровые растворы
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
					Оборудование, обработка и утилизация отходов
				  </div>
				</div>
				<div class="cell collname" style="width:100%;font-size: 11px;border-right:1px solid #FFF;display:grid;grid-template-columns: repeat(7, 1fr);">
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
	
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
					Материалы
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
					Инж. сервис
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
	
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
	
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
	
				  </div>
				  <div class="cell" style="width: 100%;border-right:1px solid #fff; border-bottom: 1px solid #fff;">
					ИТОГО
				  </div>
				</div>
				<div class="cell col" id="СТОИМОСТЬСТРОИТЕЛЬСТВАСКВАЖИНЫ" style="width:100%;"></div>
			  </div>
			</div>
			<div class="colRow">
			  <div style="width:100%">
				<div class="cell colname" style="width:100%;float:left;">
				  ПРЕДСТАВИТЕЛИ
				</div>
				<div class="cell col" id="ПРЕДСТАВИТЕЛИ" style="width:100%;"></div>
			  </div>
			</div>
		  </div>
		  </div>
		</div>
	  </div>
	
	  <style>
		.rooter {
			border-left: 1px solid #FFF;
			border-top: 1px solid #FFF;
		}
		.rooter * {
		  font-size: 11px;
		  box-sizing: border-box;
		}
		.row {
		  /* display: flex;
		  align-items: center; */
		  display: grid;
		  grid-template-columns: repeat(6, 1fr);
		}
		.cell {
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  /* padding: 0.2rem 0; */
		  /* padding: .2rem; */
		  /* padding-right: 1rem; */
		  border-right: 1px solid #FFF;
		  border-bottom: 1px solid #FFF;
		  /* margin-right: 1rem; */
		  box-sizing: border-box;
		  /* white-space: nowrap; */
		  text-align: center;
		  min-height: 2.3rem;
		}
		.colRow .cell {
		  border: none;
		}
		.colRow .colname {
		  border-right: 1px solid #FFF;
		  border-bottom: 1px solid #FFF;
		}
		.col {
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		}
		.lumn {
		  align-items: flex-start;
		  text-align: center;
		}
		.colRow {
		  display: flex;
		  border-bottom: 1px solid #FFF;
		  border-right: 1px solid #FFF;
		}
		.colname {
		  font-size: 14px;
		  font-weight: 600;
		}
	  </style>
	`,
	NNB: `
		<div id="root">
			<div class="cell" style="width:18.3%;border-top:1px solid #FFF;border-left:1px solid #FFF;">
				<div style="width: 100%;">Глубина на начало:</div>
					<div class="cell" style="border-left: 1px solid #FFF; width: 100%;" id="Глубинананачало(м)">
					</div>
				</div>
			<div class="cell" style="width:18.3%;border-left:1px solid #FFF;">
			<div style="width: 100%;">Глубина на конец:</div>
				<div class="cell" style="border-left: 1px solid #FFF; width: 100%;" id="Глубинанаконец(м)">
				</div>
			</div>
			<div class="rooter" id="container">
				<div class="headers">
					<div class="cell">№ п/п</div>
					<div class="cell">Элемент</div>
					<div class="cell">Принадлежность</div>
					<div class="cell">Серийный номер</div>
					<div class="cell">Диаметр наруж/внутр тела трубы, диаметр ВЗД, диаметр Яса (мм)</div>
					<div class="cell">Диаметр наруж/внутр замка трубы, макс. диаметр ВЗД, макс. диаметр Яса (мм)</div>
					<div class="cell">Присоединительная  резьба (тип/размер), мм</div>
					<div class="cell">Тип соединения</div>
					<div class="cell"> Длина (м)</div>
					<div class="cell">Сум. длина (м)</div>
					<div class="cell">ВЕС (кг)</div>		
				</div>
				<div id="№п/п"></div>
				<div class="cell" style="width:54.5%;">
					Комментарии по КНБК:
				</div>
				<div id="КомментариипоКНБК:" style="width:54.5%;"></div>
				<div style="display: grid; grid-template-columns: 1fr 1fr;border-bottom:1px solid #FFF;border-top: 1px solid #FFF">
					<div id="Датчики:" style="width:100%;border-bottom:1px solid #FFF"></div>
					<div id="Долото:кол-вонасадок" style="width:100%%;border-bottom:1px solid #FFF"></div>
				</div>
				<div id="Дата:" style="width:100%;border-bottom:1px solid #FFF"></div>
			</div>
		</div>
		<style>
			.cell {
				  display: flex;
				  justify-content: center;
				  align-items: center;
				  /* padding: 0.2rem 0; */
				  /* padding: .2rem; */
				  /* padding-right: 1rem; */
				  border-right: 1px solid #FFF;
				  border-bottom: 1px solid #FFF;
				  /* margin-right: 1rem; */
				  box-sizing: border-box;
				  /* white-space: nowrap; */
				  text-align: center;
				  min-height: 2.3rem;
			}
			.headers {
				display: grid;
				grid-template-columns: repeat(11, 1fr);
			}
			.rooter {
				border-left: 1px solid #FFF;
				border-top: 1px solid #FFF;
			}
			.rooter * {
			  font-size: 11px;
			  box-sizing: border-box;
			}
			@media print {
				* {
					font-size: 10px;
				}
				.cell {
					border: 1px solid #FFF;
				}
			}
		</style>
		`
	}
	
	return res[service || "Mud"]
}