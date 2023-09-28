using _Project.AI_StateMachine.Interface;
using UnityEngine;

[AddComponentMenu(("_SABI/StateMachine/Action/MoveToTarget"))]
public class AiActionMoveToTarget : SabiActionBase, ITargetSettable
{
    [SerializeField] private AiNavMeshManager navmesh;
    [SerializeField] private Transform target;

    public void SetTargetTransform(Transform value) => target = value;

    public void MoveToTarget()
    {
        navmesh.SetTargetTransform(target);
        navmesh.StartMovement();
    }
    
    public override void ActionStart() => MoveToTarget();

    public override void ActionUpdate() { }

    public override void ActionExit() { }
}