using UnityEngine;

public class AiDesetionCanHearAnything : SabiDecisionBase
{
    [SerializeField] private AiSensorHearing aiSensorHearing;

    public override bool GetResult() => (aiSensorHearing.GetCurrentSound() != null);
}