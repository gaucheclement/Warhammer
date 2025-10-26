<script>
  import { createEventDispatcher } from 'svelte'

  // Props
  export let label = "Lancer les dés"
  export let xpBonus = 0
  export let rollFunction = () => null
  export let disabled = false

  const dispatch = createEventDispatcher()

  // State management
  let state = 'idle' // 'idle' | 'rolling' | 'result'
  let result = null
  let isAnimating = false

  /**
   * Handle dice roll
   */
  async function handleRoll() {
    if (disabled || state !== 'idle') return

    state = 'rolling'
    isAnimating = true

    // Simulate dice rolling animation
    setTimeout(() => {
      result = rollFunction()
      state = 'result'
      isAnimating = false

      // Dispatch result event
      dispatch('result', { result })
    }, 800)
  }

  /**
   * Handle accept button
   */
  function handleAccept() {
    dispatch('accept', { result, xpBonus })
    reset()
  }

  /**
   * Handle reroll button
   */
  function handleReroll() {
    state = 'idle'
    result = null
    handleRoll()
  }

  /**
   * Handle manual choice
   */
  function handleManual() {
    dispatch('manual')
    reset()
  }

  /**
   * Reset to initial state
   */
  function reset() {
    state = 'idle'
    result = null
    isAnimating = false
  }
</script>

<div class="random-button-container">
  {#if state === 'idle'}
    <button
      class="roll-button"
      on:click={handleRoll}
      disabled={disabled}
    >
      <span class="dice-icon">🎲</span>
      <span class="label">{label}</span>
      {#if xpBonus > 0}
        <span class="xp-badge">+{xpBonus} XP</span>
      {/if}
    </button>
  {:else if state === 'rolling'}
    <div class="rolling-container">
      <div class="dice-animation" class:animate={isAnimating}>
        🎲
      </div>
      <span class="rolling-text">Lancer en cours...</span>
    </div>
  {:else if state === 'result'}
    <div class="result-panel">
      <div class="result-header">
        <span class="result-label">Résultat :</span>
        <span class="result-value">{result}</span>
      </div>

      <div class="action-buttons">
        <button
          class="btn-accept"
          on:click={handleAccept}
        >
          ✓ Accepter
          {#if xpBonus > 0}
            <span class="xp-bonus">+{xpBonus} XP</span>
          {/if}
        </button>

        <button
          class="btn-reroll"
          on:click={handleReroll}
        >
          🔄 Relancer
        </button>

        <button
          class="btn-manual"
          on:click={handleManual}
        >
          ⚙️ Manuel
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .random-button-container {
    width: 100%;
    margin: 1rem 0;
  }

  /* Roll Button */
  .roll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
  }

  .roll-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
  }

  .roll-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dice-icon {
    font-size: 1.5rem;
  }

  .xp-badge {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 215, 0, 0.3);
    border: 2px solid gold;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: gold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Rolling Animation */
  .rolling-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: rgba(99, 102, 241, 0.1);
    border: 2px dashed #6366f1;
    border-radius: 0.75rem;
  }

  .dice-animation {
    font-size: 3rem;
  }

  .dice-animation.animate {
    animation: roll 0.8s ease-in-out infinite;
  }

  @keyframes roll {
    0%, 100% {
      transform: rotate(0deg) scale(1);
    }
    25% {
      transform: rotate(90deg) scale(1.2);
    }
    50% {
      transform: rotate(180deg) scale(1);
    }
    75% {
      transform: rotate(270deg) scale(1.2);
    }
  }

  .rolling-text {
    font-size: 1rem;
    color: #6366f1;
    font-weight: 600;
  }

  /* Result Panel */
  .result-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%);
    border: 2px solid #6366f1;
    border-radius: 0.75rem;
  }

  .result-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .result-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
  }

  .result-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1f2937;
    padding: 0.5rem 1.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .action-buttons button {
    flex: 1;
    min-width: 120px;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-accept {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  }

  .btn-accept:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
  }

  .xp-bonus {
    display: inline-block;
    margin-left: 0.5rem;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 215, 0, 0.3);
    border-radius: 0.25rem;
    color: gold;
    font-weight: 700;
  }

  .btn-reroll {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
  }

  .btn-reroll:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
  }

  .btn-manual {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);
  }

  .btn-manual:hover {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(107, 114, 128, 0.4);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .action-buttons {
      flex-direction: column;
    }

    .action-buttons button {
      width: 100%;
      min-width: 0;
    }
  }
</style>
