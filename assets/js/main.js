Fancybox.bind("[data-fancybox]", {
	// Your custom options
});

// animation
const animationItems = document.querySelectorAll(".animation-item");
if (animationItems.length > 0) {
	function onEntry(e) {
		e.forEach((e) => {
			e.isIntersecting && e.target.classList.add("animation-active");
		});
	}
	let options = {
			threshold: [0.5],
		},
		observer = new IntersectionObserver(onEntry, options);
	for (let e of animationItems) observer.observe(e);
}
// end animation

/* hide header */
let scrollWidthFunc = () => {
	let scrollWidth = window.innerWidth - document.body.clientWidth;
	document.querySelector("html").style.paddingRight = scrollWidth + "px";
	//document.querySelector("header").style.paddingRight = scrollWidth + "px";
};

const scrollTop = document.querySelector(".scroll-top");
if (scrollTop)
	scrollTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});




document.addEventListener("DOMContentLoaded", function () {

	// Флаг для отслеживания состояния header-white
	let headerWhiteByScroll = false;
	let headerWhiteByDefault = false;

	// Intersection Observer для отслеживания положения header над intro
	const header = document.querySelector('.header');
	const intro = document.querySelector('.intro');

	if (intro && header) {
		headerWhiteByDefault = header.classList.contains("header-white");
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) {
					// Когда .intro не в зоне видимости
					if (!header.classList.contains("header-white")) {
						header.classList.add('header-white');
						headerWhiteByScroll = true;
					}
				} else {
					// Когда .intro в зоне видимости
					if (headerWhiteByScroll) {
						header.classList.remove('header-white');
						headerWhiteByScroll = false;
					}
				}
			});
		}, {
			threshold: 0,
			rootMargin: `-${header.offsetHeight}px 0px 0px 0px`
		});
		
		observer.observe(intro);
	}

	/* burger menu */
	const burgerMenu = document.querySelector(".burger");

	if (burgerMenu) {
		const headerMobile = document.querySelector(".header__menu");
		let headerWhiteTemporarilyRemoved = false;
		
		burgerMenu.addEventListener("click", () => {
			const isOpening = !burgerMenu.classList.contains("active");
			
			if (isOpening) {
				if (header.classList.contains("header-white")) {
					header.classList.remove("header-white");
					headerWhiteTemporarilyRemoved = true;
				}
			} else {
				if (headerWhiteTemporarilyRemoved && 
					(headerWhiteByScroll || headerWhiteByDefault)) {
					header.classList.add("header-white");
				}
				headerWhiteTemporarilyRemoved = false;
			}
			
			// Переключаем остальные состояния
			document.body.classList.toggle("burger-lock");
			headerMobile.classList.toggle("active");
			burgerMenu.classList.toggle("active");
			document.querySelector("html").classList.toggle("burger-lock");
		});
	}
	/* end burger menu */


	// Popups
	function popupClose(popupActive) {
		popupActive.classList.remove("open");
		setTimeout(() => {
			if (!popupActive.classList.contains("open")) {
				popupActive.classList.remove("active");
			}
		}, 400);
		document.body.classList.remove("lock");
		document.querySelector("html").style.paddingRight = 0;
		document.querySelector("html").classList.remove("lock");
		document.querySelector("header").removeAttribute("style");
	}
	const popupOpenBtns = document.querySelectorAll(".popup-btn");
	const popups = document.querySelectorAll(".popup");
	const originalTitlePopup2 = document.querySelector(".original-title").innerHTML;
	const closePopupBtns = document.querySelectorAll(".close-popup-btn");
	closePopupBtns.forEach(function (el) {
		el.addEventListener("click", function (e) {
			popupClose(e.target.closest(".popup"));
		});
	});
	popupOpenBtns.forEach(function (el) {
		el.addEventListener("click", function (e) {
			e.preventDefault();
			const path = e.currentTarget.dataset.path;
			const currentPopup = document.querySelector(`[data-target="${path}"]`);
			if (currentPopup) {
				popups.forEach(function (popup) {
					popupClose(popup);
					popup.addEventListener("click", function (e) {
						if (!e.target.closest(".popup__content")) {
							popupClose(e.target.closest(".popup"));
						}
					});
				});
				currentPopup.classList.add("active");
				setTimeout(() => {
					currentPopup.classList.add("open");
				}, 10);
				if (currentPopup.getAttribute("data-target") == "popup-change") {
					let originaTitle = currentPopup.querySelector(".original-title");
					if (el.classList.contains("change-item__btn")) {
						if (el.classList.contains("doctor__btn-js")) {
							let currentItem = el.closest(".change-item");
							let currentTitile = currentItem.querySelector(".change-item__title");
							originaTitle.innerHTML = "Записаться на приём к врачу: " + currentTitile.innerHTML;
						} else {
							if (el.classList.contains("change-item__btn_current")) {
								originaTitle.textContent = el.textContent;
							} else {
								let currentItem = el.closest(".change-item");
								let currentTitile = currentItem.querySelector(".change-item__title");
								originaTitle.innerHTML = currentTitile.innerHTML;
							}
						}
					} else {
						originaTitle.innerHTML = originalTitlePopup2;
					}
				}

				if (currentPopup.getAttribute("data-target") == "popup-jobs") {
					let currentItems = el.closest(".jobs__items");
					let originalText = currentPopup.querySelector(".jobs__inner_original");
					if (originalText && currentItems.querySelector(".jobs__inner")) {
						originalText.innerHTML = currentItems.querySelector(".jobs__inner").innerHTML;
					}
				}
				e.stopPropagation();
				scrollWidthFunc();
				document.querySelector("html").classList.add("lock");
			}
		});
	});
	// end popups

	/*  accordion  */
	const acc = document.getElementsByClassName("accordion");
	for (let i = 0; i < acc.length; i++) {
		if (acc[i]) {
			acc[i].addEventListener("click", function () {
				const accContent = this.querySelector(".accordion__content") || this.parentElement.querySelector(".accordion__content");
				if (accContent.classList.contains("active")) {
					accContent.classList.remove("active");
					this.classList.remove("active");
					accContent.style.maxHeight = "0";
				} else {
					accContent.classList.add("active");
					this.classList.add("active");

					const contentHeight = accContent.scrollHeight;
					accContent.style.maxHeight = `${contentHeight}px`;
				}
			});
		}
	}
	/*  end accordion   */

	/*  tab  */
	const showTab = (elTabBtn) => {
		const elTab = elTabBtn.closest(".tab");
		if (elTabBtn.classList.contains("tab-btn--active")) {
			return;
		}
		const targetId = elTabBtn.dataset.id;
		const elTabPanes = elTab.querySelectorAll(`.tab-content[data-id="${targetId}"]`);

		const elTabBtnActive = elTab.querySelector(".tab-btn--active");
		if (elTabBtnActive) {
			elTabBtnActive.classList.remove("tab-btn--active");
		}

		const elTabPaneShow = elTab.querySelectorAll(".tab-content--active");
		elTabPaneShow.forEach((pane) => pane.classList.remove("tab-content--active"));

		elTabBtn.classList.add("tab-btn--active");
		elTabPanes.forEach((pane) => pane.classList.add("tab-content--active"));
	};

	const tabButtons = document.querySelectorAll(".tab-btn");
	tabButtons.forEach((btn) => {
		if (btn) {
			btn.addEventListener("click", function (e) {
				showTab(this);
			});
		}
	});

	// Функция для закрытия всех табов
	const closeAllTabs = () => {
		const activeTabButtons = document.querySelectorAll(".tab-btn--active");
		const activeTabPanes = document.querySelectorAll(".tab-content--active");

		activeTabButtons.forEach((btn) => btn.classList.remove("tab-btn--active"));
		activeTabPanes.forEach((pane) => pane.classList.remove("tab-content--active"));
	};

	// Обработчик клика по документу для закрытия табов
	document.addEventListener("click", function (e) {
		const isTabButton = e.target.classList.contains("tab-btn") || e.target.closest(".tab-btn");
		if (!isTabButton) {
			closeAllTabs();
		}
	});
	/*  end tab */


	/*  btn more  */
	const moreBtns = document.querySelectorAll(".btn-more");
	moreBtns.forEach((moreBtn) => {
		if (moreBtn) {
			const moreContent = moreBtn.previousElementSibling;

			if (moreContent.scrollHeight <= moreContent.clientHeight) {
				moreBtn.style.display = "none";
			} else {
				const textBtn = moreBtn.innerHTML;
				moreBtn.addEventListener("click", function () {
					const heightMoreContent = moreContent.style.maxHeight;
					this.classList.toggle("active");

					if (moreContent.style.maxHeight) {
						moreContent.style.maxHeight = null;
						this.textContent = textBtn;
					} else {
						moreContent.style.maxHeight = moreContent.scrollHeight + "px";
						this.textContent = "Свернуть";
					}
				});
			}
		}
	});
	/*  end btn more  */


	/* прикрепить резюме - для всех блоков */
	const fileInputs = document.querySelectorAll(".resume-input");
	
	fileInputs.forEach(function(fileInput) {
		const resumeBlock = fileInput.closest('.resume-block');
		const fileDisplay = resumeBlock.querySelector('.file-display span');
		
		if (!fileDisplay) return;
		
		fileInput.addEventListener("change", function(e) {
			fileDisplay.innerHTML = "";
			
			if (this.files.length > 0) {
				const file = this.files[0];
				createFileElement(file, fileInput, fileDisplay);
			}
		});
	});
	
	function createFileElement(file, inputElement, displayElement) {
		const fileItem = document.createElement("div");
		fileItem.className = "file-item";
		
		const fileName = document.createTextNode(file.name);
		
		const removeBtn = document.createElement("span");
		removeBtn.className = "file-remove";
		removeBtn.innerHTML = "×";
		removeBtn.title = "Удалить файл";
		
		removeBtn.addEventListener("click", function() {
			fileItem.remove();
			clearFileInput(inputElement, displayElement);
		});
		
		fileItem.appendChild(fileName);
		fileItem.appendChild(removeBtn);
		displayElement.appendChild(fileItem);
	}
	
	function clearFileInput(inputElement, displayElement) {
		const newInput = inputElement.cloneNode(true);
		inputElement.parentNode.replaceChild(newInput, inputElement);
		
		const resumeBlock = newInput.closest('.resume-block');
		const updatedDisplay = resumeBlock.querySelector('.file-display span');
		
		newInput.addEventListener("change", function(e) {
			if (updatedDisplay) {
				updatedDisplay.innerHTML = "";
			}
			if (this.files.length > 0) {
				const file = this.files[0];
				createFileElement(file, newInput, updatedDisplay);
			}
		});
	}



	/* кнопка Показать еще */
    // Храним состояния кнопок
    const buttonStates = new WeakMap();

    function restoreVisibilityAfterFilter() {
        document.querySelectorAll('.btn-show').forEach(button => {
            const state = buttonStates.get(button);
            if (state && state.visibleCount > 0) {
                applyButtonState(button);
            }
        });
    }

    function showAllButtons() {
        const allButtons = document.querySelectorAll('.btn-show');
        
        allButtons.forEach(button => {
            const parentBlock = button.closest('.show-block');
            const items = parentBlock.querySelectorAll('.show-item');
            
            const activeItems = Array.from(items).filter(item => 
                !item.classList.contains('hidden')
            );
            
            const defaultCount = button.getAttribute('data-show-count');
            const initialCount = defaultCount ? parseInt(defaultCount) : 8;
            
            const step = 4;
            
            let state = buttonStates.get(button);
            if (!state) {
                state = {
                    visibleCount: initialCount,
                    textShow: button.innerHTML,
                    textHide: 'Скрыть'
                };
                buttonStates.set(button, state);
            }
            
            if (activeItems.length <= initialCount) {
                button.style.display = 'none';
                items.forEach(item => {
                    if (!item.classList.contains('hidden')) {
                        item.style.display = '';
                    }
                });
            } else {
                button.style.display = 'block';
                applyButtonState(button);
                
                button.onclick = function() {
                    const state = buttonStates.get(button);
                    const activeItems = Array.from(items).filter(item => 
                        !item.classList.contains('hidden')
                    );
                    
                    if (state.visibleCount >= activeItems.length) {
                        state.visibleCount = initialCount;
                        button.textContent = state.textShow;
                    } else {
                        state.visibleCount = Math.min(state.visibleCount + step, activeItems.length);
                        
                        if (state.visibleCount >= activeItems.length) {
                            button.textContent = state.textHide;
                        }
                    }
                    
                    applyButtonState(button);
                };
            }
        });
    }

    // Функция применения состояния кнопки к элементам
    function applyButtonState(button) {
        const state = buttonStates.get(button);
        if (!state) return;
        
        const parentBlock = button.closest('.show-block');
        const items = parentBlock.querySelectorAll('.show-item');
        
        let activeIndex = 0;
        items.forEach(item => {
            if (!item.classList.contains('hidden')) {
                if (activeIndex < state.visibleCount) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
                activeIndex++;
            } else {
                item.style.display = 'none';
            }
        });
        
        const activeItems = Array.from(items).filter(item => !item.classList.contains('hidden'));
        if (state.visibleCount >= activeItems.length) {
            button.textContent = state.textHide;
        } else {
            button.textContent = state.textShow;
        }
    }

    showAllButtons();
    /* end кнопка Показать еще */
});
