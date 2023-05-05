class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000
        this._totalCalories = 0
        this._meals = []
        this._workouts = []

        this._displayCaloriesLimit()
        this._render()
    }

    // API

    addMeal(meal) {
        this._meals.push(meal)
        this._totalCalories += meal.calories
        this._displayNewMeal(meal)
        this._render()
    }

    addWorkout(workout) {
        this._workouts.push(workout)
        this._totalCalories -= workout.calories
        this._displayNewWorkout(workout)
        this._render()
    }

    removeMeal(id) {
        const index = this._meals.findIndex(meal => meal.id === id)
        if (index !== -1) {
            const meal = this._meals[index]
            this._totalCalories -= meal.calories
            this._meals.splice(index, 1)
            this._render()
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex(workout => workout.id === id)
        if (index !== -1) {
            const workout = this._workouts[index]
            this._totalCalories += workout.calories
            this._workouts.splice(index, 1)
            this._render()
        }
    }

    // PRIVATE METHODS

    _displayCaloriesLimit() {
        const coloriesLimitEl = document.getElementById('calories-limit')
        coloriesLimitEl.innerHTML = this._calorieLimit
    }

    _displayCaloriesTotal() {
        const caloriesTotalEl = document.getElementById('calories-total')
        caloriesTotalEl.innerHTML = this._totalCalories
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed')
        caloriesConsumedEl.innerHTML = this._meals.reduce((total, meal) => total += meal.calories, 0)
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned')
        caloriesBurnedEl.innerHTML = this._workouts.reduce((total, workout) => total += workout.calories, 0)
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining')
        const remaining = this._calorieLimit - this._totalCalories
        caloriesRemainingEl.innerHTML = remaining

        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light')
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger')
            caloriesRemainingEl.parentElement.parentElement.classList.add('text-white')
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger')
            caloriesRemainingEl.parentElement.parentElement.classList.remove('text-white')
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light')
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress')
        const percentage = (this._totalCalories / this._calorieLimit) * 100
        const width = Math.min(percentage, 100)
        progressEl.style.width = `${width}%`

        if (percentage >= 100) {
            progressEl.classList.add('bg-danger')
        } else {
            progressEl.classList.remove('bg-danger')
        }
    }

    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items')
        const mealEl = document.createElement('div')
        mealEl.classList.add('card', 'my-2')
        mealEl.setAttribute('data-id', meal.id)
        mealEl.innerHTML = `
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div
              class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
            >
                ${meal.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        `
        mealsEl.appendChild(mealEl)
    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items')
        const workoutEl = document.createElement('div')
        workoutEl.classList.add('card', 'my-2')
        workoutEl.setAttribute('data-id', workout.id)
        workoutEl.innerHTML = `
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div
              class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
            >
                ${workout.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        `
        workoutsEl.appendChild(workoutEl)
    }

    _render() {
        this._displayCaloriesTotal()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned()
        this._displayCaloriesRemaining()
        this._displayCaloriesProgress()
    }

}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

class App {
    constructor() {
        this._tracker = new CalorieTracker()
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'))
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'))
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'))
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'))
    }

    _newItem(type, e) {
        e.preventDefault()
        const name = document.getElementById(`${type}-name`)
        const calories = document.getElementById(`${type}-calories`)

        if (name.value === '' || calories.value === '') {
            alert('Please entre name and calories')
            return
        }

        if (type === 'meal') {
            const item = new Meal(name.value, Number(calories.value))
            this._tracker.addMeal(item)
        } else {
            const item = new Workout(name.value, Number(calories.value))
            this._tracker.addWorkout(item)
        }

        name.value = ''
        calories.value = ''

        const collapse = document.getElementById(`collapse-${type}`)
        new bootstrap.Collapse(collapse, {
            toggle: true
        })
    }

    _removeItem(type, e) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure you want to delete this ' + type + '?')) {
                const id = e.target.closest('.card').getAttribute('data-id')
                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id)
                e.target.closest('.card').remove()
            }
        }
    }
}

const app = new App()

