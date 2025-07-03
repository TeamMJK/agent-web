<template>
    <div class="workspace-container">
        <!-- 헤더 영역 -->
        <div class="workspace-header">
            <h1 class="workspace-title">워크스페이스</h1>
            <button class="add-schedule-btn" @click="showAddScheduleModal = true">
                <i class="pi pi-plus"></i>
                <span>일정 추가</span>
            </button>
        </div>

        <!-- 캘린더 네비게이션 -->
        <div class="calendar-nav">
            <button class="nav-btn" @click="previousMonth">
                <i class="pi pi-angle-left"></i>
            </button>
            <h2 class="current-month">{{ currentMonthYear }}</h2>
            <button class="nav-btn" @click="nextMonth">
                <i class="pi pi-angle-right"></i>
            </button>
        </div>

        <!-- 캘린더 그리드 -->
        <div class="calendar-container">
            <div class="calendar-header">
                <div v-for="day in weekDays" :key="day" class="day-header">
                    {{ day }}
                </div>
            </div>
            <div class="calendar-grid">
                <div 
                    v-for="date in calendarDates" 
                    :key="date.key"
                    :class="['calendar-date', {
                        'other-month': !date.isCurrentMonth,
                        'today': date.isToday,
                        'selected': isDateSelected(date.date),
                        'has-events': date.events.length > 0
                    }]"
                    @click="selectDate(date.date)"
                >
                    <span class="date-number">{{ date.day }}</span>
                    <div v-if="date.events.length > 0" class="events-container">
                        <div 
                            v-for="(event, index) in date.events.slice(0, 3)" 
                            :key="event.id"
                            :class="['event-bar', getEventBarClass(event, date.date)]"
                            :style="{ 
                                backgroundColor: event.color, 
                                top: `${24 + index * 18}px`
                            }"
                        >
                            <span v-if="isEventStart(event, date.date)" class="event-title-bar">
                                {{ event.title }}
                            </span>
                        </div>
                        <span v-if="date.events.length > 3" class="more-events">
                            +{{ date.events.length - 3 }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 선택된 날짜의 일정 목록 -->
        <div v-if="selectedDate" class="selected-date-events">
            <h3 class="events-title">{{ formatSelectedDate }} 일정</h3>
            <div v-if="selectedDateEvents.length === 0" class="no-events">
                등록된 일정이 없습니다.
            </div>
            <div v-else class="events-list">
                <div 
                    v-for="event in selectedDateEvents" 
                    :key="event.id"
                    class="event-item"
                    :style="{ borderLeftColor: event.color }"
                >
                    <div class="event-info">
                        <h4 class="event-title">{{ event.title }}</h4>
                        <p class="event-time">{{ formatDateRange(event.startDate, event.endDate) }}</p>
                        <p v-if="event.description" class="event-description">{{ event.description }}</p>
                    </div>
                    <button class="delete-event-btn" @click="deleteEvent(event.id)">
                        <i class="pi pi-trash"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- 일정 추가 모달 -->
        <div v-if="showAddScheduleModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>일정 추가</h3>
                    <button class="close-btn" @click="closeModal">
                        <i class="pi pi-times"></i>
                    </button>
                </div>
                <form @submit.prevent="addSchedule" class="schedule-form">
                    <div class="form-group">
                        <label>제목</label>
                        <input 
                            type="text" 
                            v-model="newSchedule.title" 
                            placeholder="일정 제목을 입력하세요"
                            required
                            class="form-input"
                        />
                    </div>
                    <div class="form-row">
                        <div class="form-group half">
                            <label>시작 날짜</label>
                            <input 
                                type="date" 
                                v-model="newSchedule.startDate" 
                                required
                                class="form-input"
                            />
                        </div>
                        <div class="form-group half">
                            <label>종료 날짜</label>
                            <input 
                                type="date" 
                                v-model="newSchedule.endDate" 
                                required
                                class="form-input"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>설명 (선택사항)</label>
                        <textarea 
                            v-model="newSchedule.description" 
                            placeholder="일정에 대한 설명을 입력하세요"
                            class="form-textarea"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label>색상</label>
                        <div class="color-picker">
                            <div 
                                v-for="color in availableColors" 
                                :key="color"
                                :class="['color-option', { selected: newSchedule.color === color }]"
                                :style="{ backgroundColor: color }"
                                @click="newSchedule.color = color"
                            ></div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" @click="closeModal">취소</button>
                        <button type="submit" class="submit-btn">추가</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkSpaceScreen',
    data() {
        return {
            currentDate: new Date(),
            selectedDate: null,
            showAddScheduleModal: false,
            weekDays: ['일', '월', '화', '수', '목', '금', '토'],
            availableColors: ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#9013FE', '#50E3C2'],
            events: [], // 추후 백엔드에서 가져올 데이터
            newSchedule: {
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                color: '#4A90E2'
            }
        };
    },
    computed: {
        currentMonthYear() {
            return this.currentDate.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long' 
            });
        },
        calendarDates() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            const endDate = new Date(lastDay);

            // 달력 시작일 (이전 달의 마지막 주)
            startDate.setDate(startDate.getDate() - startDate.getDay());
            // 달력 종료일 (다음 달의 첫 주)
            endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

            const dates = [];
            const current = new Date(startDate);

            while (current <= endDate) {
                const dateStr = this.formatDate(current);
                const dayEvents = this.events.filter(event => 
                    this.isDateInRange(dateStr, event.startDate, event.endDate)
                );
                
                dates.push({
                    date: new Date(current),
                    day: current.getDate(),
                    isCurrentMonth: current.getMonth() === month,
                    isToday: this.isToday(current),
                    events: dayEvents,
                    key: current.toISOString()
                });
                current.setDate(current.getDate() + 1);
            }
            return dates;
        },
        selectedDateEvents() {
            if (!this.selectedDate) return [];
            const selectedDateStr = this.formatDate(this.selectedDate);
            return this.events.filter(event => 
                this.isDateInRange(selectedDateStr, event.startDate, event.endDate)
            );
        },
        formatSelectedDate() {
            if (!this.selectedDate) return '';
            return this.selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        }
    },
    methods: {
        previousMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        },
        nextMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        },
        selectDate(date) {
            this.selectedDate = date;
        },
        isDateSelected(date) {
            return this.selectedDate && this.formatDate(date) === this.formatDate(this.selectedDate);
        },
        isToday(date) {
            const today = new Date();
            return date.toDateString() === today.toDateString();
        },
        formatDate(date) {
            return date.toISOString().split('T')[0];
        },
        closeModal() {
            this.showAddScheduleModal = false;
            this.resetNewSchedule();
        },
        resetNewSchedule() {
            this.newSchedule = {
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                color: '#4A90E2'
            };
        },
        addSchedule() {
            // 기본 유효성 검사
            if (!this.newSchedule.title.trim()) return;
            if (!this.newSchedule.startDate) return;
            if (!this.newSchedule.endDate) return;
            if (this.newSchedule.startDate > this.newSchedule.endDate) {
                alert('종료 날짜는 시작 날짜보다 늦어야 합니다.');
                return;
            }

            const newEvent = {
                id: Date.now(), // 임시 ID (추후 백엔드에서 생성)
                title: this.newSchedule.title.trim(),
                startDate: this.newSchedule.startDate,
                endDate: this.newSchedule.endDate,
                description: this.newSchedule.description.trim(),
                color: this.newSchedule.color
            };

            // 로컬 상태에 추가 (추후 백엔드 API 호출로 대체)
            this.events.push(newEvent);
            
            // TODO: 백엔드 API 호출
            // this.postScheduleToBackend(newEvent);
            
            this.closeModal();
            console.log('일정 추가됨:', newEvent);
        },
        deleteEvent(eventId) {
            if (confirm('이 일정을 삭제하시겠습니까?')) {
                this.events = this.events.filter(event => event.id !== eventId);
                
                // TODO: 백엔드 API 호출
                // this.deleteScheduleFromBackend(eventId);
                
                console.log('일정 삭제됨:', eventId);
            }
        },
        isDateInRange(dateStr, startDate, endDate) {
            return dateStr >= startDate && dateStr <= endDate;
        },
        isEventStart(event, date) {
            return this.formatDate(date) === event.startDate;
        },
        isEventEnd(event, date) {
            return this.formatDate(date) === event.endDate;
        },
        isSingleDayEvent(event) {
            return event.startDate === event.endDate;
        },
        getEventBarClass(event, date) {
            const dateStr = this.formatDate(date);
            const isStart = dateStr === event.startDate;
            const isEnd = dateStr === event.endDate;
            const isSingle = this.isSingleDayEvent(event);
            
            if (isSingle) {
                return 'single-day';
            } else if (isStart) {
                return 'start-day';
            } else if (isEnd) {
                return 'end-day';
            } else {
                return 'middle-day';
            }
        },
        formatDateRange(startDate, endDate) {
            const start = new Date(startDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const end = new Date(endDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            if (startDate === endDate) {
                return start;
            }
            return `${start} - ${end}`;
        },
        // 추후 백엔드 연동용 메서드들
        async postScheduleToBackend(schedule) {
            // TODO: 실제 API 호출 구현
            console.log('백엔드로 일정 전송:', schedule);
        },
        async deleteScheduleFromBackend(scheduleId) {
            // TODO: 실제 API 호출 구현
            console.log('백엔드에서 일정 삭제:', scheduleId);
        },
        async fetchSchedulesFromBackend() {
            // TODO: 실제 API 호출 구현
            console.log('백엔드에서 일정 목록 가져오기');
        }
    },
    mounted() {
        // 컴포넌트 마운트 시 오늘 날짜 선택
        this.selectedDate = new Date();
        
        // TODO: 백엔드에서 일정 목록 가져오기
        // this.fetchSchedulesFromBackend();
    }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

.workspace-container {
    font-family: "Pretendard Variable", Pretendard, sans-serif;
    width: 90%;
    margin: 0 auto;
    color: #E0E0E0;
    min-height: 100vh;
    box-sizing: border-box;
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 16px;
}

.workspace-title {
    font-size: 2.2rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    background: linear-gradient(90deg, #4A90E2, #00D0FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.add-schedule-btn {
    background: linear-gradient(45deg, #4A90E2, #66A6FF);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
    display: flex; /* 아이콘과 텍스트를 한 줄에 표시 */
    align-items: center; /* 세로 중앙 정렬 */
}

.add-schedule-btn i {
    margin-right: 8px; /* 아이콘과 텍스트 사이 간격 */
    font-size: 18px;
}

.add-schedule-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
}

.calendar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 10px;
}

.nav-btn {
    background: #2D2D2D;
    border: none;
    color: #A0A0A0;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-btn:hover {
    background: #3A3A3A;
    color: #fff;
    transform: translateY(-1px);
}

.nav-btn i {
    font-size: 20px;
}

.current-month {
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    text-align: center;
    flex: 1;
}

.calendar-container {
    background: #232323;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 40px;
    width: 100%;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.calendar-container:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: linear-gradient(to right, #2D2D2D, #353535);
}

.day-header {
    padding: 20px 8px;
    text-align: center;
    font-weight: 600;
    color: #B0B0B0;
    font-size: 15px;
    min-height: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    background: #2A2A2A;
    padding: 2px;
}

.calendar-date {
    min-height: 120px;
    padding: 10px;
    background: #1E1E1E;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
}

.calendar-date:hover {
    background: #2D2D2D;
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.calendar-date.other-month {
    color: #555;
    background: #171717;
}

.calendar-date.today {
    background: linear-gradient(45deg, #4A90E2, #66A6FF);
    color: white;
}

.calendar-date.selected {
    background: #357ABD;
    color: white;
    box-shadow: 0 4px 12px rgba(53, 122, 189, 0.4);
}

.calendar-date.has-events .date-number {
    font-weight: 600;
}

.date-number {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
    line-height: 1.2;
    text-align: right;
}

.events-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.event-bar {
    position: absolute;
    height: 16px;
    left: 2px;
    right: 2px;
    border-radius: 4px;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
    margin: 2px 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-bar:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.event-bar.single-day {
    border-radius: 8px;
    left: 6px;
    right: 6px;
}

.event-bar.start-day {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    right: 0;
    margin-left: 6px;
}

.event-bar.end-day {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    left: 0;
    margin-right: 6px;
}

.event-bar.middle-day {
    border-radius: 0;
    left: 0;
    right: 0;
}

.event-title-bar {
    padding-left: 6px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 9px;
    line-height: 1;
}

.more-events {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 9px;
    color: #A0A0A0;
    background: rgba(0, 0, 0, 0.7);
    padding: 2px 4px;
    border-radius: 4px;
    z-index: 2;
}

.events-indicator {
    display: none; /* 기존 점 표시 숨김 */
}

/* 기존 event-dot 스타일 제거하거나 숨김 */
.event-dot {
    display: none;
}

.selected-date-events {
    background: #232323;
    border-radius: 16px;
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.events-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 20px 0;
}

.no-events {
    color: #A0A0A0;
    text-align: center;
    padding: 30px;
    font-size: 15px;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.event-item {
    background: #2D2D2D;
    border-radius: 12px;
    padding: 20px;
    border-left: 5px solid;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.event-info {
    flex: 1;
}

.event-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 6px 0;
}

.event-time {
    font-size: 14px;
    color: #B0B0B0;
    margin: 0 0 10px 0;
}

.event-description {
    font-size: 15px;
    color: #C0C0C0;
    margin: 0;
    line-height: 1.5;
}

.delete-event-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    transition: all 0.2s ease;
    margin-left: 10px;
}

.delete-event-btn:hover {
    color: #FF5252;
    background: rgba(255, 82, 82, 0.1);
}

.delete-event-btn i {
    font-size: 16px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: #232323;
    border-radius: 16px;
    width: 90%;
    max-width: 550px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0 24px;
}

.modal-header h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}

.close-btn i {
    font-size: 20px;
}

.schedule-form {
    padding: 24px;
}

.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    font-weight: 500;
    color: #fff;
    margin-bottom: 10px;
    font-size: 15px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group.half {
    flex: 1;
}

.form-input, .form-textarea {
    width: 100%;
    padding: 14px;
    background: #2D2D2D;
    border: 1px solid #3A3A3A;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    box-sizing: border-box;
    transition: all 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.5;
}

.color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
}

.color-option {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-option:hover {
    transform: scale(1.1);
}

.color-option.selected {
    border-color: #fff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
}

.cancel-btn {
    background: #3A3A3A;
    color: #fff;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background: #4A4A4A;
    transform: translateY(-1px);
}

.submit-btn {
    background: linear-gradient(45deg, #4A90E2, #66A6FF);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.submit-btn:hover {
    box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
    transform: translateY(-1px);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
    .workspace-container {
        padding: 16px;
    }
    
    .workspace-title {
        font-size: 1.5rem;
    }
    
    .add-schedule-btn {
        padding: 10px 20px;
        font-size: 13px;
    }
    
    .current-month {
        font-size: 1.2rem;
    }
    
    .calendar-date {
        min-height: 80px;
        padding: 6px;
    }
    
    .date-number {
        font-size: 13px;
    }
    
    .day-header {
        padding: 12px 4px;
        font-size: 12px;
    }
    
    .event-dot {
        width: 4px;
        height: 4px;
    }
    
    .more-events {
        font-size: 9px;
    }
}

@media (max-width: 480px) {
    .workspace-container {
        padding: 12px;
    }
    
    .workspace-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }
    
    .workspace-title {
        font-size: 1.3rem;
        text-align: center;
    }
    
    .add-schedule-btn {
        width: 100%;
        justify-content: center;
    }
    
    .calendar-date {
        min-height: 60px;
        padding: 4px;
    }
    
    .date-number {
        font-size: 12px;
    }
    
    .day-header {
        padding: 8px 2px;
        font-size: 11px;
    }
    
    .current-month {
        font-size: 1.1rem;
    }
    
    .nav-btn {
        min-width: 32px;
        height: 32px;
    }
    
    .selected-date-events {
        padding: 16px;
    }
}

@media (min-width: 1400px) {
    .workspace-container {
        padding: 40px;
    }
    
    .calendar-date {
        min-height: 140px;
    }
}
</style>
