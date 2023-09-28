
using SABI.AnimationStatemachine;
using Sirenix.OdinInspector;
using UnityEngine;
using UnityEngine.Events;

[AddComponentMenu(("_SABI/StateMachine/Action/AiActionPlayAnimationRepeatedlyWithDelay"))]
public class AiActionPlayAnimationRepeatedlyWithDelay : SabiActionBase
{
    [SerializeField] [DisplayAsString] private bool isDelayBtwAttackOver = true;
    [SerializeField] private float delayBtwEachAnimation = 1;
    [SerializeField] private SabiAnimationontroller animationController;
    [SerializeField] private AnimationStateSO animationState;
    [SerializeField] private bool useAnimationLayer = false;
    [SerializeField] [ShowIf(nameof(useAnimationLayer))] private AnimationLayerSO animationLayer;

    public override void ActionStart() { }

    public override void ActionUpdate()
    {
        if (AttackCondition()) Attack();
    }

    public override void ActionExit() { }

    bool AttackCondition() => isDelayBtwAttackOver;

    void Attack()
    {
        isDelayBtwAttackOver = false;
        if(useAnimationLayer) animationController.SetAnimationLayer(animationLayer);
        animationController.SetAndRunState(animationState);
        Invoke(nameof(ResetDelayBtwAttackOver), delayBtwEachAnimation);
    }

    void ResetDelayBtwAttackOver() => isDelayBtwAttackOver = true;
}