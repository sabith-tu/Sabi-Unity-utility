using UnityEngine;

public class AiDescisionCanSeeSomething : SabiDecisionBase
{
    [SerializeField] private FieldOfView fieldOfView;
    [SerializeField] private FieldOfView fieldOfView2;
    [SerializeField] private bool useSecondVision = false;
    [SerializeField] private AllThingsAiCanSee whatToLookFor = AllThingsAiCanSee.Player;

    [SerializeField] private bool whatIsTheValue = false;

    public override bool GetResult()
    {
        if ((fieldOfView.visibleTargets.Count > 0) || ((useSecondVision) && (fieldOfView2.visibleTargets.Count > 0)))
        {
            bool canSeePlayer = false;
            foreach (var VARIABLE in fieldOfView.visibleTargets)
            {
                if (VARIABLE.GetComponent<AiCanSee>().whatIsThis == whatToLookFor)
                {
                    canSeePlayer = true;
                }
            }

            if (useSecondVision)
            {
                if (canSeePlayer == false)
                {
                    foreach (var VARIABLE in fieldOfView2.visibleTargets)
                    {
                        if (VARIABLE.GetComponent<AiCanSee>().whatIsThis == whatToLookFor)
                        {
                            canSeePlayer = true;
                        }
                    }
                }
            }


            whatIsTheValue = canSeePlayer;


            return canSeePlayer;
        }
        else
        {
            whatIsTheValue = false;
            return false;
        }
    }
}