using _Project.AI_StateMachine.Interface;
using UnityEngine;

[AddComponentMenu(("_SABI/StateMachine/Action/ChaseMovingTarget"))]
public class AiActionChaseMovingTarget : SabiActionBase , ITargetSettable
{
    [SerializeField] private Transform target;
    [SerializeField] private AiNavMeshManager navmesh;
    
    public void SetTargetTransform(Transform value) => target = value;

    public override void ActionStart() => navmesh.StartMovement();

    public override void ActionUpdate()
    {
        if (Vector3.Distance(target.position, transform.position) > 1)
        {
            navmesh.StartMovement();
            navmesh.SetTargetTransform(target);
        }
        else
        {
            navmesh.StopMovement();
        }
    }

    public override void ActionExit() => navmesh.StopMovement();
}